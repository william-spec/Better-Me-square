//*****************************获取数据并创建内容框
function createDiv(width = '200px', height = ''){   //创建包裹Div框
  let div = document.createElement('div');
  div.className = 'item';
  div.style.width = width;
  div.style.backgroundColor = '#F5F5F6';
  div.style.borderRadius = '10%';
  div.style.overflow = 'hidden';
  div.style.height = height;
  div.style.position = 'absolute';
  itemWidth = parseInt(width);
  return div;
}

function createDivText(text){   //创建顶部文字内容
  let divText = document.createElement('div');
  divText.style.width = '100%';
  divText.style.boxSizing = 'border-box';
  divText.style.wordBreak = 'break-all';
  divText.style.textAlign = 'left';
  divText.style.padding = '5px 5px';
  divText.style.fontSize = '13px';
  divText.style.backgroundColor = '#A8DBFD';
  divText.innerText = text;
  return divText;
}

function createDivImg(src){    //晒进度
  let divImg = document.createElement('div');
  divImg.className = 'img';
  divImg.style.width = '100%';
  divImg.style.height = 100 + 'px';
  divImg.style.display = 'block';
  divImg.style.boxSizing = 'border-box';
  divImg.style.border = '1px solid gray';
  divImg.style.backgroundSize =  divImg.style.width + ' 100px' ;
  divImg.setAttribute('data-src', 'url(' + src + ')');   //先将src保存下来
  return divImg;
}

function createDetailDiv(){   //创建底部框（用户，评论等）
  let detailDiv = document.createElement('div');
  detailDiv.style.position = 'relative';
  detailDiv.style.height = '38px';
  return detailDiv;
}

function createUserPhoto(src, width = '30px', top = '2px', left = '2px'){   //创建用户头像
  let userPhoto = document.createElement('div');
  userPhoto.className = 'img';
  userPhoto.style.width = width;
  userPhoto.style.height = width;
  userPhoto.style.borderRadius = '50%';
  userPhoto.style.border = '1px solid black';
  userPhoto.style.position = 'absolute';
  userPhoto.style.top = top;
  userPhoto.style.left = left;
  userPhoto.style.backgroundSize = width + ' ' + width ;
  userPhoto.setAttribute('data-src', 'url(' + src + ')');   //先将src保存下来
  return userPhoto;
}

function createUserName(text, email, left = '37px', top = '2px', fontSize = '10px'){    //创建用户名
  let userName = document.createElement('div');
  userName.style.position = 'absolute';
  userName.innerText = text;
  userName.style.fontSize = fontSize;
  userName.style.top = top;
  userName.style.left = left;
  userName.style.cursor = 'pointer';
  userName.setAttribute('data-email', email);
  userName.onclick = jumpToUserPost;   //跳到个人发布页
  return userName;
}

function createUserContent(content, line = '2', left = '37px', bottom = '2px', fontSize = '10px'){    //创建用户个性签名
  let userContent = document.createElement('div');
  userContent.style.position = 'absolute';
  userContent.innerText = content;
  userContent.style.fontSize = fontSize;
  userContent.style.bottom = bottom;
  userContent.style.left = left;
  userContent.style.wordBreak = 'break-all';
  userContent.style.overflow = 'hidden';
  userContent.style.textOverflow = 'ellipsis';
  userContent.style.display = '-webkit-box';
  userContent.style.webkitBoxOrient = 'vertical';
  userContent.style.webkitLineClamp = line;
  return userContent;
}

function createUpdateTime(update, fontSize = '10px', top = '2px', right = '7px'){    //创建发布时间
  let updateTime = document.createElement('div');
  updateTime.style.position = 'absolute';
  updateTime.innerText = update;
  updateTime.style.fontSize = fontSize;
  updateTime.style.top = top;
  updateTime.style.right = right;
  return updateTime;
}

function createComments(data){    //创建评论
  let comments = document.createElement('div');
  comments.innerHTML = `
    <img src="../../public/assets/icons/comment.png" style='width: 15px; height: auto'>
  `;
  comments.innerHTML += `
    <div style= 'border: none; font-size: 10px; 
    display: inline-block; width: 25px; width: 25px; position: relative;
    top: 4px; overflow: hidden; white-space: nowrap; 
    text-overflow: ellipsis;'>`
      + data.commentsNum +
    `</div>
  `;
  comments.style.position = 'absolute';
  comments.style.top = 15 + 'px';
  comments.style.right = 7 + 'px';
  comments.setAttribute('data-obj', JSON.stringify(data));
  comments.style.cursor = 'pointer';
  comments.style.boxSizing = 'border-box';
  comments.onclick = jumpToDetail;    //跳到评论页
  return comments;
}

function createStars(starsNum, fontSize = '10px', top = '15px', right = '55px', numberTop = '3px'){   //创建点赞
  let stars = document.createElement('div');
  stars.innerHTML = `
    <img src="../../public/assets/icons/heart.png" style='width: 15px; height: auto background-color: transparent'>
  `;
  stars.innerHTML += `
    <div style= 'border: none; font-size:` + fontSize + `; 
    display: inline-block; width: 30px; position: relative;
    top: ` + numberTop + `; overflow: hidden; white-space: nowrap; 
    text-overflow: ellipsis;'>`
      + starsNum +
    `</div>
  `;
  stars.style.position = 'absolute';
  stars.id = 'createStars';
  stars.style.top = top;
  stars.style.right = right;
  stars.style.cursor = 'pointer';
  stars.style.boxSizing = 'border-box';
  stars.onclick = addStarsNumber;    //增加点赞数
  return stars;
}

function jumpToUserPost(){    //跳到个人发布页
  // 获取该用户信息，跳到该用户主页
  window.location.href = './userPost.html?user=' + this.innerText + '&email=' + this.getAttribute('data-email');  //点击用户名将用户名包含在url中传到个人发布页面
  event.stopPropagation();    //阻止事件进一步冒泡
}

function addStarsNumber(){
  let div = this.children[1];
  let num = div.innerText;
  if(div.style.color !== 'red'){
    div.style.color = 'red';
    div.innerText = ++num;
  }
  else{
    div.style.color = 'black';
    div.innerText = --num;
  }
  event.stopPropagation();    //阻止事件进一步冒泡
}

function jumpToDetail(){
  // 跳转到详情页，可以编辑评论等
  window.location.href = './detailContent.html?obj=' + 
                        this.getAttribute('data-obj')
                        ;  //点击评论将该用户email和帖子id包含在url中传到个人发布页面
                        event.stopPropagation();    //阻止事件进一步冒泡
}

function getTime(){
  let date = new Date();
  let year = date.getFullYear();
  let month = date.getMonth() + 1;
  let day = date.getDate();
  return year + '-' + month + '-' + day;
}

function search(req, deal){    //使用ajax发送请求获取数据库数据
  let res = queryData(req);
  if(deal)
    deal(res);
  return res;
}

function queryData(req){    //在数据集中查找数据
  let res = [];
  if(req.type === 'square')
      res = squareDB.slice(req.start, req.start + req.num);
  else if(req.type === 'userPost'){
    let arr = squareDB.filter(item => item.email === req.email);
    res = arr.slice(req.start, req.start + req.num);
  }
  else{
    let arr = commentsDB.filter(item => item.email === req.email && item.id === req.id);
    res = arr.slice(req.start, req.start + req.num);
  }
  if(res.length === 0) alert('用户不可访问或已经没有数据啦！');
  return res;
}


//创建前端数据
let squareDB = [];
let commentsDB = [];
for(let i = 1; i < 6; i++)
    squareDB.push({
        'id': i,
        'text': '打卡' + i,
        'imgSrc': '',
        'email': '432113@163.com',
        'userPhotoSrc': '../../public/assets/userPhoto/1.jpg',
        'userName': '黑色幽默',
        'starsNum': i * i,
        'commentsNum': i * (i + 1),
        'updateTime': '2020-9-' + i * 2,
        'userSign': '还是喜欢一些仪式感，很小很轻在某一瞬间，气泡在杯沿爆裂，瓜果丰盈，睡莲妩媚，钟意的香水影片，地毯边光影昏暗。像是少年时把喜欢一个人，作为心头大愿，饱满，热忱，像一颗夏日的果实。'
        })



for(let i = 1; i< 16; i++)
  squareDB.push({
        'id': i,
        'text': '这是来到Better-Me的第' + i + '天，一起加油！',
        'imgSrc': '',
        'email': '293283947@qq.com',
        'userPhotoSrc': '../../public/assets/userPhoto/2.jpg',
        'userName': '一颗小白菜',
        'starsNum': 5 * i,
        'commentsNum': 10 * i,
        'updateTime': '2020-11-' + i * 2,
        'userSign': '我生怕自己本非美玉，故而不敢加以刻苦琢磨，却又半信自己是块美玉，故又不肯庸庸碌碌，与瓦砾为伍。'
        })



for(let i = 1; i< 58; i++)
  squareDB.push({
        'id': i,
        'text': '第' + i + '天，没必要让所有人知道真实的你，或者是你没有必要不停地向人说其实我是一个什么样的人。因为这是无效的，人们还是只会愿意看到他们希望看到的。我甚至觉得你把真实的自己隐藏在这些误解背后还挺好的。',
        'imgSrc': 'http://img.xjh.me/random_img.php?type=bg&ctype=nature&return=302',
        'email': '237457@qq.com',
        'userPhotoSrc': '../../public/assets/userPhoto/3.jpg',
        'userName': '北方的狼',
        'starsNum': 5 * i,
        'commentsNum': i * (i + i),
        'updateTime': '2020-11',
        'userSign': '人生本来就不太公平，有人天生长得可爱，有人天生干吃不胖，有人生下来就坐享其成，但我希望你也有自己的超能力，比如不会被生活打败。'
        })



for(let i = 1; i< 30; i++)
  squareDB.push({
        'id': i,
        'text': '第' + i + '天，也许每一个男子全都有过这样的两个女人，至少两个．娶了红玫瑰，久而久之，红的变了墙上的一抹蚊子血，白的还是“床前明月光”；娶了白玫瑰，白的便是衣服上的一粒饭粘子，红的却是心口上的一颗朱砂痣。',
        'imgSrc': '../../public/assets/jindutu/2.png',
        'email': '1234444444675@sina.com',
        'userPhotoSrc': '../../public/assets/userPhoto/4.jpg',
        'userName': 'asdajfl',
        'starsNum': 5 * i,
        'commentsNum': i * i,
        'updateTime': '2019-7',
        'userSign': 'Its better to be alone than to be with someone youre not happy to be with. '
        })



for(let i = 1; i< 10; i++)
  squareDB.push({
        'id': i,
        'text': '第' + i + '天，一个人最好的生活状态，是该看书时看书，该玩时尽情玩，看见优秀的人欣赏，看到落魄的人也不轻视，有自己的小生活和小情趣，不用去想改变世界，努力去活出自己。没人爱时专注自己，有人爱时，有能力拥抱彼此。上的一颗朱砂痣。',
        'imgSrc': '../../public/assets/jindutu/1.jpeg',
        'email': 'william@sina.com',
        'userPhotoSrc': '../../public/assets/userPhoto/5.jpg',
        'userName': '青儿',
        'starsNum': 5 * i,
        'commentsNum': i * i,
        'updateTime': '2021-1-' + i * 2,
        'userSign': '养好受伤的头发，保持百斤左右体重，照顾好挑剔的胃，交一个能一路废话的朋友，给自己疲惫的生活，找一个温柔的梦想，然后彻彻底底跟过去的悲伤道别，这就是我接下来要去做的事。' 
        })


squareDB.forEach(
  function(item){                
      for(let i = 0; i < 20; i++)
          commentsDB.push({
              'email': item.email,
              'id': item.id,
              'commentUserName': item.starsNum + item.userName,
              'commentUserEmail': item.email,
              'commentUserPhoto': item.userPhotoSrc,
              'comment': Math.random() + item.email + item.userName
          })
  }
)