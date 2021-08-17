function post(){
  let post = document.querySelector('#postComments').querySelector('div');
  post.addEventListener('click',() => {
    let value = document.querySelector('textarea').value;
    if(value === ''){
      alert('请输入内容');
      return;
    } 
    document.querySelector('textarea').value = '';
    putItems(createContent([{
      'comment': value,
      'commentUserEmail': me.email,
      'commentUserPhoto': me.userPhotoSrc,
      'commentUserName': me.userName
    }])
    );
    let comments = document.querySelector('#comments');
    comments.innerText = '评论 ' + allDivs.length;
  })
}

function createContent(data){   //创建完整框
  let divs = [];    //临时div数组，用于保存框，append到页面上
  data.forEach((data) => {    //创建包裹图片的div，此时图片不显示
    let div = createDiv('100%', '65px');
    let userPhoto = createUserPhoto(data.commentUserPhoto, '50px', '7px');
    div.appendChild(userPhoto);
    let userName = createUserName(data.commentUserName, '', '60px', '10px');
    div.appendChild(userName);
    let commentsContent = createUserContent(data.comment, '1', '60px', '8px');
    div.appendChild(commentsContent);
    divs.push(div);
  })
  allDivs.push(...divs);    //添加到全局div数组中，用于判断是否进入视窗，懒加载
  return divs;
}

function getUserInfo(obj){    //渲染帖子内容、我的头像、用户名、点赞数、更新时间
  let text = document.querySelector('#text');
  text.innerHTML = obj.text;
  let plan = document.querySelector('#plan');
  plan.style.backgroundImage = 'url(' + obj.imgSrc + ')';
  plan.style.backgroundSize = '100% 100px';
  let fillblank = document.querySelector('#fillblank');
  fillblank.appendChild(createStars(obj.starsNum, '14px', '8px', '100px', '3px'));
  fillblank.appendChild(createUpdateTime(obj.updateTime, '14px', '11px'));
  let userPhotoDiv = createUserPhoto(obj.userPhotoSrc, '40px');
  userPhotoDiv.style.backgroundImage = userPhotoDiv.getAttribute('data-src');
  fillblank.appendChild(userPhotoDiv);
  fillblank.appendChild(createUserName(obj.userName, '', '50px', '15px'));
  let comments = document.querySelector('#comments');
  comments.innerHTML += localData.length;
}

function deal(data){    //处理服务端返回的数据
  localData.length = 0;
  localData.push(...data)   /* 将请求的数据保存到本地 */
}

async function getDetailContent(){    //获取个人发布
  let str = window.location.href.slice(window.location.href.indexOf('?') + 1);  //获取网址中的参数
  str = decodeURI(str.slice(str.indexOf('=') + 1));
  let obj = JSON.parse(str);
  me = obj;
  req.email = obj.email;
  req.id = obj.id;
  await ajaxSend('POST', 'http://localhost:3000', false, req, deal);
  getUserInfo(obj);
  putItems(createContent(localData) /* 注意初始化数据一定要超出页面大小，否则初始化无法触发效果 */, false);
}

async function getMoreData(){   //滚动条滚到底部获取更多数据
  req.start += req.num;
  await ajaxSend('POST', 'http://localhost:3000', false, req, deal);
  putItems(createContent(localData), false);
}

let me = {};
let localData = [];   //只保存当前次返回的数据，无需保存之前次返回的数据
  
let req = {
  type: 'detailContent',   //请求类型
  start: 0,   //请求起始位置
  num: 32   //每次请求32条数据
}
window.onload = function(){
  post();
  getDetailContent();
  window.addEventListener('scroll', () => { checkScroll(getMoreData); });
}

window.onresize = function(){
  columns = getColumns(itemWidth);    //更新页面尺寸后需要重新计算列数
  putItems(allDivs, true);   //重新渲染
}