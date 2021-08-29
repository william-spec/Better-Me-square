function post(){    //发布功能
  let post = document.querySelector('#contentPublisher_post');
  post.addEventListener('click',() => {
    let value = document.querySelector('textarea').value;
    if(value === ''){
      alert('请输入内容');
      return;
    } 
    document.querySelector('textarea').value = '';
    let userPhotoSrc = document.querySelector('.user-info').querySelector('img').src;
    let obj = {
                'id': 1,
                'text': value,
                'imgSrc': '',
                'email': '',
                'userPhotoSrc': '../../public/assets/topBar/user-pic.jpg',
                'userName': 'Me',
                'starsNum': 0,
                'commentsNum': 0,
                'updateTime': getTime(),
                'userSign': 'I am fine'
              }
    updateData(obj);
  })
}

function createContent(data){   //创建完整的展示内容框
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
    let userPhoto = createUserPhoto(data.userPhotoSrc);
    detailDiv.appendChild(userPhoto);
    let userName = createUserName(data.userName, data.email);
    detailDiv.appendChild(userName);
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

function deal(data){    //处理服务端返回的数据
  dbData.length = 0;
  for(let i = 0; i < data.length; i++){   //打乱数组顺序
    let r = Math.floor(Math.random() * data.length);
    let temp = data[i];
    data[i] = data[r];
    data[r] = temp;
  }
  dbData.push(...data);
}

function dealInsertID(data){
  req._id = data.insertedId;
}

async function getInitData(){   //初始化广场页面
  //等待数据请求完毕后才渲染，使用async和await
  req.url = 'square';
  await ajaxSend(req, deal);
  putItems(createContent(dbData), false, getColumns(), masonry);
}

async function getMoreData(){   //滚动条滚到底部获取更多数据
  req.url = 'square';
  req.start += req.num;
  delete req._id;
  await ajaxSend(req, deal);
  putItems(createContent(dbData), false, getColumns(), masonry);
}

async function updateData(obj){   //滚动条滚到底部获取更多数据
  req.url = 'insertSquare';
  req.obj = obj;
  await ajaxSend(req, dealInsertID);
  delete req.obj;
  req.url = 'square';
  await ajaxSend(req, deal);
  putItems(createContent(dbData), false, getColumns(), masonry);
}

let masonry = document.querySelector('#masonry');
let dbData = [];   //只保存当前次返回的数据，无需保存之前次返回的数据
let req = {
  method: 'POST',
  async: false,
  url: 'square',   //请求类型
  start: 0,   //请求起始位置
  num: 32   //每次请求32条数据
}

window.onload = function(){
  post();
  getInitData();
  window.addEventListener('scroll', () => { checkScroll(getMoreData); });
}

window.onresize = function(){
  columns = getColumns(itemWidth);    //更新页面尺寸后需要重新计算列数
  putItems([], true, getColumns(), masonry);   //重新渲染
}