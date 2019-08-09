

const express = require('express');
const app = express();

app.get('/',(req,res)=>{
    const a = 123;
    res.send('hello world!');
});

app.listen(3000,()=>console.log('program is running on port 3000!'))

/*
let v = 0;

function a(v){
    const v2 = 100;
    v+=v2;
}

function b(){
    a(v);
}

b(v);
*/