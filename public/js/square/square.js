let profilePhoto = document.querySelector('.user-info').querySelector('img');   //获取自己的头像
// profilePhoto.addEventListener('click', profileManage);
// 登陆后显示为用户头像，否则为默认头像

function post(){
  let date = new Date();
  let year = date.getFullYear();
  let month = date.getMonth() + 1;
  let day = date.getDate();
  let post = document.querySelector('#contentPublisher_post');
  post.addEventListener('click',() => {
    let value = document.querySelector('textarea').value;
    if(value === ''){
      alert('请输入内容');
      return;
    } 
    document.querySelector('textarea').value = '';
    putItems(createContent([{
      'id': 1,
      'text': value,
      'imgSrc': '',
      'email': '',
      'userPhotoSrc': '../../public/assets/topBar/user-pic.jpg',
      'userName': 'Me',
      'starsNum': 0,
      'commentsNum': 0,
      'updateTime': year + '-' + month + '-' + day,
      'userSign': 'I am fine'
    }])
    );
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
  allDivs.push(...divs);    //添加到全局div数组中，用于判断是否进入视窗，懒加载
  return divs;
}

function deal(data){    //处理服务端返回的数据
  localData.length = 0;
  for(let i = 0; i < data.length; i++){   //打乱数组顺序
    let r = Math.floor(Math.random() * data.length);
    let temp = data[i];
    data[i] = data[r];
    data[r] = temp;
  }
  localData.push(...data)   /* 将请求的数据保存到本地 */
}

async function getInitData(){   //初始化广场页面
  //等待数据请求完毕后才渲染，使用async和await
  await ajaxSend('POST', 'http://localhost:3000', false, req, deal);
  putItems(createContent(localData) /* 注意初始化数据一定要超出页面大小，否则初始化无法触发效果 */, false);
}

async function getMoreData(){   //滚动条滚到底部获取更多数据
  req.start += req.num;
  await ajaxSend('POST', 'http://localhost:3000', false, req, deal);
  putItems(createContent(localData), false);
}

function postContent(){   //点击发布按钮发布内容
  // let text = document.querySelector('contentPublisher_content').value;
  // let imgSrc = document
}

let localData = [];   //只保存当前次返回的数据，无需保存之前次返回的数据

let req = {
  type: 'square',   //请求类型
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
  putItems(allDivs, true);   //重新渲染
}