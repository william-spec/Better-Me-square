//*****************************瀑布流效果

function getColumns(itemWidth = '200px'){    //获取当前窗口能放下的最大列数并返回
  let windowWidth = window.innerWidth * 0.9;    //可能会产生一些误差
  itemWidth = parseInt(itemWidth);
  let columns = parseInt(windowWidth/itemWidth);
  return columns;
}

function putItemsBiBao(){    //使用闭包避免将heights设置成全局变量，避免变量污染，闭包类似于创建了对于其内部函数的一个全局，在外部函数里内部函数外（全局）定义的变量就相当于在全局定义的变量，会保存其改变值，并且延长生命周期不会被释放
  let heights = [];    //记录一行中各列的高度
  return function (divs /* 框数组 */, resize /* 判断是否是页面大小变化 */, columns, box){    //根据列数进行摆放图片
    if(divs.length === 1){    //如果发表内容，那么将新发表内容放在头条位置刷新页面
      allDivs.unshift(...divs);
      heights = [];
      divs = allDivs;
      box.appendChild(divs[0]);
    } 
    else if(resize){
      heights = [];
      divs = allDivs;
    }
    else
      allDivs.push(...divs);
    divs.forEach((div, index) => {    //将不显示图片的div添加到页面合适位置
      if(!resize) box.appendChild(div);
      if(div.style.width === '100%')
      {
        if(heights.length === 0){
          div.style.top = 0 + 'px';
          heights.push(parseInt(getComputedStyle(div).height));
        }
        else{
          div.style.top = heights[0] + 15 + 'px';
          heights[0] += parseInt(getComputedStyle(div).height) + 15;
        }
      }
      else{
        if(heights.length < columns){    //第一行图片
          div.style.top = 0;   //顶格排放
          div.style.left = index * itemWidth + index * 40 + 40 + 'px';
          heights.push(parseInt(getComputedStyle(div).height));
        }
        else{   //其他行图片
          let minHeight = Math.min(...heights);   //获取所有列中的最小高度，优先摆放在高度最小的位置
          let minIndex = heights.indexOf(minHeight);    //获取最小高度的索引
          div.style.top = minHeight + 50 + 'px';
          div.style.left = minIndex * itemWidth + minIndex * 40 + 40 + 'px';
          heights[minIndex] = minHeight + 50 + parseInt(getComputedStyle(div).height);   //更新高度
        }
      }
    })
    delayLoad();
  }
}

function checkScroll(getMoreData){   //判断滚动条到底后加载更多图片
  let pageHeight = document.documentElement.scrollHeight;   //页面总高
  let viewHeight = document.documentElement.clientHeight;   //视窗高度
  let scrollTop = document.documentElement.scrollTop || window.pageYOffset || document.body.scrollTop;    //滚动条已滚动的高度，兼容不同浏览器
  if(pageHeight - viewHeight - scrollTop === 0){
    //加载更多图片
    getMoreData();
  }
  delayLoad();
}

function delayLoad(){   //懒加载，只对图片懒加载，其他无src属性的节点懒加载无意义
  let viewHeight = document.documentElement.clientHeight;
  let scrollTop = document.documentElement.scrollTop || window.pageYOffset || document.body.scrollTop;    //兼容不同浏览器
  allDivs.forEach(div => {
    if(div.offsetTop - scrollTop <= viewHeight - 90 - 200){   //如果进入视窗，那么将图片url（存在data-src属性中）赋值给src属性，显示图片
      let children = Array.from(div.children);
      children.forEach(div => {
        if(div.className === 'img')
          div.style.backgroundImage = div.getAttribute('data-src');
        let children = Array.from(div.children);
        children = children.filter(div => div.className === 'img');
        if(children[0])
          children[0].style.backgroundImage = children[0].getAttribute('data-src');   //懒加载进度图和用户头像
      })
    }
  })
}

let putItems = putItemsBiBao();   //闭包函数调用
let allDivs = [];   //全局数组，用于懒加载判断，保存所有已经加载的内容