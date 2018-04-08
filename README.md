动画 之 canvas 优化
===
## 前言
> canvas性能是一个经常会遇到的问题，特别在canvas玩多了以后，
自然而然的就会考虑如何优化性能。可以让自己的动画丝滑的表现.
首先应该理解什么是动画，流畅的动画的标准是什么，canvas 处理和渲染动画原理，再结合相关的工具调试、优化我们的动画。

## 动画

### 什么是动画
>动画是一种动态的媒介，是以一定的速度（如每秒16张）连续播放时，肉眼因视觉残象产生的错觉

动画英文："Animation" 一词源自于拉丁文字根anima，意思为“灵魂”，动词animate是“赋予生命”的意思，引申为使某物活起来的意思。
简单来说就是在一定的时间快速的连续播放序列图像（关键帧），就像放电影一样。而在我看来，动画就是在一个空间一定时间内每个对象按照固定的运动轨迹呈现的画面。

### FPS （每秒传输帧数(Frames Per Second)）
> FPS是图像领域中的定义，是指画面每秒传输帧数

   相信玩过动画的人都知道fps，通俗来讲就是每秒的关键帧数。那么多少的fps是最佳的呢？理论上来说：每秒钟帧数愈多，所显示的动作就会愈流畅。
然而，现实是残酷的，其中原因是在显示“分辨率”不变的情况下，FPS越高，则对显卡的处理能力要求越高。电脑的显示画面是通过显卡进行输出的，假设分辨率是1024×768时，
画面的刷新率要达到24帧/秒，那么显卡在一秒钟内需要处理的像素量就达到了“1024×768×24=18874368”。
可想而知，这种频率的增加的数量级是很恐怖的。所以，一般来说，显示器默认的刷新频率在85hz左右。

   究竟多少的fps是最合适呢？由于人类眼睛的特殊生理结构，如果所看画面之帧率高于每秒约10-12帧的时候，就会认为是连贯的， 此现象称之为[视觉暂留](https://en.wikipedia.org/wiki/Persistence_of_vision)。
这里可以看到10-12帧只是连贯而已。google告诉我们大约15.75Hz是人体对显示器最低要求的刷新频率，一般人不觉得卡顿的FPS频率大约是30Hz（fps），想要达到流畅等级则需要60Hz（fps），也就是16.66ms
一帧。
   其实，我们前端，主要的载体还是浏览器。然而浏览器又有一套自己的repaint的频率。这里就必须提到强大的requestAnimationFrame(后面会详细介绍)

## Canvas
> canvas最常见的用途就在于渲染动画，尤其是处理数量级庞大的动画。

### 计算与渲染
> canvas 是如何计算和渲染的

- 计算：处理相关的逻辑，计算对象状态，DOM操作等
- 渲染：
    
   - 调用相关AIP（canvas API）渲染
   - 渲染线程进行渲染 （这个可以不用管，交给浏览器处理）
   
我们来看张图：

![js 计算](http://img.alicdn.com/tps/TB1i6rMLpXXXXaZXFXXXXXXXXXX-593-323.png)

从图中可以看到，我们需要在16ms内（60fps）处理一帧画面：计算和渲染。

### API的消耗
> 在试图优化绘图性能时，我们往往将注意力只放在图形渲染上。实际上，操纵状态机也会导致性能上的开销。

我们知道几乎canvas API所有都是在context上调用的。然而可能并不是很清楚context是一个状态机。
当你改变 context 的若干状态，而几乎所有的渲染操作，最终的效果与 context 本身的状态有关系。
所以，调用canvas API也会导致性能上都开销。那么具体哪些API都开销比较大呢。
我们来看看网友提供的这张图：
![Canvas API 消耗](http://vlambda.com/img?url=http://mmbiz.qpic.cn/mmbiz/meG6Vo0MeviasMJGOO597rwXeuicNmMW7No21Nibmt0ubcQDYueticgPGQ9kD5g47hGAw02T99RibRVibBiatePnBrRuQ/0?wx_fmt=jpeg)
从上图可以看出，API消耗也上有大小之分的，我们应该"避重就轻"，调整调用顺序，与调用的频率

### 优化
> 通过前面的了解，我们可以看到优化可以通过几个方面来实现，减少计算，减少API调用
#### 缓存 - 预渲染（display list）

使用缓存，其是就是离屏渲染（预渲染），计算机图形学叫：[display list](https://en.wikipedia.org/wiki/Display_list)。原理：先绘制一个或者多个离屏的canvas，然后在通过drawImage把这个canvas画到主canvas。
我们在做动画的时候，常常会遇到连续多帧重绘相似的物体或者文本渲染操作，这种时候，我们就可以使用预渲染，将会带来强烈的性能提升。
我们来看个demo：
核心代码：
```
    paint (ctx) {
        if (!this.useCache) {
         ctx.save()
         let j = 0
         ctx.lineWidth = borderWidth
         for (let i = 1; i < this.r; i += borderWidth) {
             ctx.beginPath()
             ctx.strokeStyle = this.color[j]
             ctx.arc(this.x, this.y, i, 0, 2 * Math.PI)
             ctx.stroke()
             j++
         }
         ctx.restore()
        } else {
         ctx.drawImage(this.cacheCanvas, this.x - this.r, this.y - this.r)
        }
    }
        
    cache () {
     this.cacheCtx.save()
     let j = 0
     this.cacheCtx.lineWidth = borderWidth
     for (let i = 1; i < this.r; i += borderWidth) {
         this.cacheCtx.beginPath()
         this.cacheCtx.strokeStyle = this.color[j]
         this.cacheCtx.arc(this.r, this.r, i, 0, 2 * Math.PI)
         this.cacheCtx.stroke()
         j++
     }
     this.cacheCtx.restore()
    }

```

这里，我们需要注意两点：
- 离屏的canvas大小，一定要设置大小，并且canvas恰好适应你准备渲染的图片的大小，
否则过大的canvas会导致我们获取的性能提升被将一个较大的画布复制到另外一个画布的操作带来的性能损失所抵消掉
- 如果效果是会将对象不停地创建和销毁，请慎重使用离屏canvas。大量的离屏canvas不停地被创建和销毁，会导致canvas buffer耗费大量GPU资源，
容易造成浏览器崩溃或者严重卡帧现象

#### 减少API操作
上文提到了，API的调用也是有性能的消耗的。尤其是在我们绘制数量级较大的场景：飘雪花、星空闪烁等，特别需要注意。
例如：
```
// bad: 
for (var i = 0; i < points.length - 1; i++) {  
  var p1 = points[i];  
  var p2 = points[i+1];  
  context.beginPath();  
  context.moveTo(p1.x, p1.y);  
  context.lineTo(p2.x, p2.y);  
  context.stroke();  
}  

// good: 
context.beginPath();  
for (var i = 0; i < points.length - 1; i++) {  
  var p1 = points[i];  
  var p2 = points[i+1];  
  context.moveTo(p1.x, p1.y);  
  context.lineTo(p2.x, p2.y);  
}  
context.stroke(); 
```

#### 避免不必要的context状态更改
我们都知道来context是状态机，状态机可以跟踪诸如fill、stroke-style以及组成当前路径的previous points等等。
我们来看看反复更改context状态对性能的影响。例如：如果你使用多种填充色来渲染一个场景，
按照不同的颜色分别渲染要比通过canvas上的布局来进行渲染要更加节省资源。
为了渲染一副条纹的图案，你可以这样渲染：用一种颜色渲染一条线条，然后改变颜色，渲染下一条线条，如此反复：
```
for (var i = 0; i < STRIPES; i++) {  
  context.fillStyle = (i % 2 ? COLOR1 : COLOR2);  
  context.fillRect(i * GAP, 0, GAP, 480);  
}  
```
也可以先用一种颜色渲染所有的偶数线条再用另外一种染色渲染所有的基数线条：

```
context.fillStyle = COLOR1;  
for (var i = 0; i < STRIPES/2; i++) {  
  context.fillRect((i*2) * GAP, 0, GAP, 480);  
}  
context.fillStyle = COLOR2;  
for (var i = 0; i < STRIPES/2; i++) {  
  context.fillRect((i*2+1) * GAP, 0, GAP, 480);  
}    
```
下面的性能测试用例分别用上边两种方法绘制了一副交错的细条纹图案：
![交错渲染对比](http://img.my.csdn.net/uploads/201203/29/1333008831_6552.png)
正如我们预期的，交错改变状态的方法要慢的多，原因是变化状态机是有额外开销的。


#### Canvas 分层 
分层，我们写页面的时候也经常会考虑到。并且这个概念思想被广泛用于图形相关的领域：从古老的皮影戏、套色印刷术，到现代电影/游戏工业，虚拟现实领域；
在canvas中我们绘制一张较大的图片的代价是昂贵的，我们应该尽量避免，除了离屏渲染方式，我们可以把我们的动画分为：前景和背景（或者更多层）
我们可以通过前景的透明度，我们可以在渲染时依靠GPU整合不同的alpha值，进行分层渲染。这样我们就不需要每次都修改背景canvas，
甚至直接用背景图片代替，可以用相较慢的速度（相对于前景）来渲染背景，这样便可利用人眼的一些视觉特性达到一定程度的立体感，这样会更吸引用户的眼球

#### 避免浮点计算
当你画一个没有整数坐标点的对象时会发生子像素渲染。浏览器为了达到抗锯齿的效果会做额外的运算。这个消耗是巨大的。
我们可以看看这个demo：[demo](https://googlechrome.github.io/devtools-samples/jank/)
优化：
```

// 取整
function getInt(num){
    var rounded;
    rounded = (0.5 + num) | 0;
    // A double bitwise not.
    rounded = ~~ (0.5 + num);
    // Finally, a left bitwise shift.
    rounded = (0.5 + num) << 0;

    return rounded;
}

```
#### requestAnimationFrame
然而不同都浏览器repaint都时间是统一都。但是这个方法确能告诉我们什么时候重绘，这样就不会过度绘制、掉帧、卡顿。
它的优势包括：
- 在用户没有盯着游戏时减少客户机上的工作量
- 节省移动设备上的用电。
- 如果更新循环与呈现循环有关联，那么可以有效地暂停游戏


更多：
- [requestAnimationFrame for Smart Animating](https://www.paulirish.com/2011/requestanimationframe-for-smart-animating/)
- [css3-animation-requestanimationframe-tween-动画算法](http://www.zhangxinxu.com/wordpress/2013/09/css3-animation-requestanimationframe-tween-%E5%8A%A8%E7%94%BB%E7%AE%97%E6%B3%95/)

## 总结

总的来说，canvas优化围绕着怎样在最快都时间内（16ms，实际10ms左右）去绘制一帧画面。达到流畅丝滑的效果。
- 通过计算和判断，避免无谓的绘制操作。
- 将固定的内容预先绘制在离屏 Canvas 上以提高性能。
- 使用多个分层的 Canvas 绘制复杂场景
- 减少不必要的API调用，额外的运算开销

### 更多tips
- 将画布的函数调用集合到一起（例如，画一条折线，而不要画多条分开的直线）
- 用CSS transforms特性缩放画布
- 不要在用drawImage时缩放图像
- 渲染画布中的不同点，而非整个新状态
- 尽可能避免 shadowBlur特性
- 尽可能避免text rendering
- 使用不同的办法去清除画布(clearRect() vs. fillRect() vs. 调整canvas大小)
- 请谨慎使用大型物理库
- 避免「阻塞」
### 优化小工具
- [chrome devTools](https://developers.google.com/web/tools/chrome-devtools/?hl=zh-cn)
- [jsperf](https://jsperf.com/)
 
   


