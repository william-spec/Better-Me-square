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
  allDivs.push(...divs);    //添加到全局div数组中，用于判断是否进入视窗，懒加载
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

function deal(data){    //处理服务端返回的数据
  localData.length = 0;
  localData.push(...data)   /* 将请求的数据保存到本地 */
}

async function getUserContent(){    //获取个人发布
  let str = window.location.href.slice(window.location.href.indexOf('?'));
  let email = str.split('&')[1].split('=')[1];
  req.email = email;
  await ajaxSend('POST', 'http://localhost:3000', false, req, deal);
  getUserInfo(localData[0].userPhotoSrc, localData[0].userName, localData[0].userSign);
  putItems(createContent(localData) /* 注意初始化数据一定要超出页面大小，否则初始化无法触发效果 */, false);
}

async function getMoreData(){   //滚动条滚到底部获取更多数据
  req.start += req.num;
  await ajaxSend('POST', 'http://localhost:3000', false, req, deal);
  putItems(createContent(localData), false);
}

let localData = [];   //只保存当前次返回的数据，无需保存之前次返回的数据

let req = {
  type: 'userPost',   //请求类型
  start: 0,   //请求起始位置
  num: 32   //每次请求32条数据
}

window.onload = function(){
  getUserContent()
  window.addEventListener('scroll', () => { checkScroll(getMoreData); });
}

window.onresize = function(){
  columns = getColumns(itemWidth);    //更新页面尺寸后需要重新计算列数
  putItems(allDivs, true);   //重新渲染
}