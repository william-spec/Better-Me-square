function hide(){    //由于评论框会遮挡最下面评论，设置按钮对透明度进行更改
  let comment = document.querySelector('#postComments');
  let button = comment.querySelector('.hide');
  if(comment.style.opacity !== '0.3'){
    comment.style.opacity = 0.3;
    button.style.transform = 'scale(0.3) rotate(180deg)';
  }
  else{
    comment.style.opacity = 1;
    button.style.transform = 'scale(0.3)';
  }
  event.stopPropagation();
}

function post(){    //评论功能
  let post = document.querySelector('#postComments').querySelector('div');
  post.addEventListener('click',() => {
    let value = document.querySelector('textarea').value;
    if(value === ''){
      alert('请输入内容');
      return;
    } 
    document.querySelector('textarea').value = '';
    let userPhotoSrc = document.querySelector('.user-info').querySelector('img').src;
    let obj = {
      'comment': value,
      'commentUserEmail': 'me',
      'commentUserPhoto': userPhotoSrc,
      'commentUserName': 'Me'
    }
    updateData(obj);
    let comments = document.querySelector('#comments');
    let num = comments.innerText.match(/\d+/g);
    comments.innerText = '评论 ' + ++num;
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
  comments.innerHTML += dbData.length;
}

function deal(data){    //处理服务端返回的数据
  if(data.length === 0)alert('已经到底啦');
  dbData.length = 0;
  dbData.push(...data)   /* 将请求的数据保存到本地 */
}

function dealInsertID(data){
  req._id = data.insertedId;
}

async function getDetailContent(){    //获取个人发布
  req.email = contentOwner.email;
  req.id = contentOwner.id;
  await ajaxSend(req, deal);
  getUserInfo(contentOwner);
  putItems(createContent(dbData), false, getColumns(), masonry);
}

async function getMoreData(){   //滚动条滚到底部获取更多数据
  req.type = 'detailContent-query';
  req.start += req.num;
  delete req._id;
  await ajaxSend(req, deal);
  putItems(createContent(dbData), false, getColumns(), masonry);
  let comments = document.querySelector('#comments');
  comments.innerText = '评论 ' + allDivs.length;
}

async function updateData(obj){   //滚动条滚到底部获取更多数据
  req.type = 'detailContent-insert';
  req.obj = obj;
  await ajaxSend(req, dealInsertID);
  delete req.obj;
  req.type = 'detailContent-query';
  await ajaxSend(req, deal);
  putItems(createContent(dbData), false, getColumns(), masonry);
}

let str = window.location.href.slice(window.location.href.indexOf('?') + 1);  //获取网址中的参数
str = decodeURI(str.slice(str.indexOf('=') + 1));
let contentOwner = JSON.parse(str);
let dbData = [];   //只保存当前次返回的数据，无需保存之前次返回的数据
let req = {
  method: 'POST',
  async: false,
  type: 'detailContent-query',   //请求类型
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
  putItems([], true, getColumns(), masonry);   //重新渲染
}