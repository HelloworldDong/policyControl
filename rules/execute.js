function exe_on(){
  console.log("on");
}

function exe_set(){
  console.log('set');
}

function exe_off(){
  console.log('off');
}

module.exports={
  exe_on:exe_on,
  exe_off:exe_off,
  exe_set:exe_set
};