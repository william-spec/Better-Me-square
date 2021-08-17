//********************************* 背景动画
let date = new Date();
let seconds = date.getHours() * 3600 + date.getMinutes() * 60 + date.getSeconds();
seconds = seconds - 6 * 3600;   //把早上六点当作太阳在地平线的位置，算出相对于早上六点的秒数
let halfDays = 43200;   //整个环形动画由animation执行两次完成，所以一次动画周期为半天的秒数
let initPositionX = - halfDays * 2;   //initPositionX、initPositionY用来确定小球的初始位置（水平左/早上六点钟）
let initPositionY = - halfDays * 1.5;
let param1 =  initPositionX - seconds;    //param1、param2用来确定小球根据当时时间的位置
let param2 = initPositionY - seconds;
let ball = document.querySelector('#ball');
// 该动画以半天（12小时）的总秒数为周期；初始位置由initPositionX、initPositionY确定，位于水平左边，代表早上六点，并随着时间移动；上半圆代表白天，下半圆代表黑夜
ball.style.animation = 'animX ' + halfDays + 's cubic-bezier(0.36,0,0.64,1)' + param1 + 's infinite alternate, animY ' + halfDays + 's cubic-bezier(0.36,0,0.64,1)' + param2 + 's infinite alternate';