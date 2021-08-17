function createContent(data){   //创建完整框
  let divs = [];    //临时div数组，用于保存框，append到页面上
  data.forEach((data) => {    //创建包裹图片的div，此时图片不显示
    let div = createDiv();
    let divText = createDivText(data.text);
    div.appendChild(divText);
    if(data.imgSrc !== ''){   //如果晒了进度那么就显示
      let divImg = createDivImg(data.imgSrc);
      div.appendChild(divImg);
    }
    let detailDiv = createDetailDiv();
    let updateTime = createUpdateTime(data.updateTime);
    detailDiv.appendChild(updateTime);
    let comments = createComments(data);
    detailDiv.appendChild(comments);
    let stars = createStars(data.starsNum);
    detailDiv.appendChild(stars);
    div.appendChild(detailDiv);
    divs.push(div);
  })
  return divs;
}

function getUserInfo(userPhoto, userName, userSign){    //渲染我的头像、用户名和个性签名
  let userInfo = document.querySelector('#userInfo');
  let userPhotoDiv = createUserPhoto(userPhoto, '90px', '30px', '5px');
  userPhotoDiv.style.backgroundImage = userPhotoDiv.getAttribute('data-src');
  userInfo.appendChild(userPhotoDiv);
  let userNameDiv = createUserName(userName, '', '110px', '30px', '20px');
  userNameDiv.style.cursor = 'default';
  userNameDiv.onclick = '';
  userInfo.appendChild(userNameDiv);
  userInfo.appendChild(createUserContent(userSign, '2', '110px', '30px', '18px'));
}

function getInitData(){    //获取个人发布
  let str = window.location.href.slice(window.location.href.indexOf('?'));
  let email = str.split('&')[1].split('=')[1];
  req.email = email;
  let res = search(req);
  getUserInfo(res[0].userPhotoSrc, res[0].userName, res[0].userSign);
  putItems(createContent(res), false, getColumns(), masonry);
}

function getMoreData(){   //滚动条滚到底部获取更多数据
  req.start += req.num;
  putItems(createContent(search(req)), false, getColumns(), masonry);
}

let masonry = document.querySelector('#masonry');
let req = {
  type: 'userPost',   //请求类型
  start: 0,   //请求起始位置
  num: 32   //每次请求32条数据
}

window.onload = function(){
  getInitData();
  window.addEventListener('scroll', () => { checkScroll(getMoreData); });
}

window.onresize = function(){
  putItems([], true, getColumns(), masonry);   //重新渲染
}