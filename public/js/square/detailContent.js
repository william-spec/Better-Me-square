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

function post(){    //给评论按钮添加点击事件
  let post = document.querySelector('#postComments').querySelector('div');
  post.addEventListener('click',() => {
    let value = document.querySelector('textarea').value;
    if(value === ''){
      alert('请输入内容');
      return;
    } 
    document.querySelector('textarea').value = '';
    let userPhotoSrc = document.querySelector('.user-info').querySelector('img').src;   //获取导航栏我的头像
    putItems(createContent([{
      'comment': value,
      'commentUserEmail': '',
      'commentUserPhoto': userPhotoSrc,
      'commentUserName': 'Me'
    }]), false, getColumns(), masonry
    );
    let comments = document.querySelector('#comments');
    let Num = parseInt(comments.innerText.match(/\d+/)[0]) + 1;
    comments.innerText = '评论 ' + Num;
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

function getUserInfo(data){    //渲染帖子内容、我的头像、用户名、点赞数、更新时间
  let text = document.querySelector('#text');
  text.innerHTML = data.text;
  let plan = document.querySelector('#plan');
  plan.style.backgroundImage = 'url(' + data.imgSrc + ')';
  plan.style.backgroundSize = '100% 100px';
  let fillblank = document.querySelector('#fillblank');
  fillblank.appendChild(createStars(data.starsNum, '14px', '8px', '100px', '3px'));
  fillblank.appendChild(createUpdateTime(data.updateTime, '14px', '11px'));
  let userPhotoDiv = createUserPhoto(data.userPhotoSrc, '40px');
  userPhotoDiv.style.backgroundImage = userPhotoDiv.getAttribute('data-src');
  fillblank.appendChild(userPhotoDiv);
  fillblank.appendChild(createUserName(data.userName, '', '50px', '15px'));
  let comments = document.querySelector('#comments');
  comments.innerHTML += data.commentsNum;
}

function getInitData(){    //获取个人发布
  let str = window.location.href.slice(window.location.href.indexOf('?') + 1);  //获取网址中的参数
  str = decodeURI(str.slice(str.indexOf('=') + 1));
  let res = JSON.parse(str);
  getUserInfo(res);
  req.email = res.email;
  req.id = res.id;
  putItems(createContent(search(req)), false, getColumns(), masonry);
}

function getMoreData(){   //滚动条滚到底部获取更多数据
  req.start += req.num;
  putItems(createContent(search(req)), false, getColumns(), masonry);
}

let masonry = document.querySelector('#masonry');
let req = {
  type: 'detailContent',   //请求类型
  start: 0,   //请求起始位置
  num: 32   //每次请求32条数据
}

window.onload = function(){
  post();
  getInitData();
  window.addEventListener('scroll', () => { checkScroll(getMoreData); });
}

window.onresize = function(){
  putItems([], true, getColumns(), masonry);   //重新渲染
}