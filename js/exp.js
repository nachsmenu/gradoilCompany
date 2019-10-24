function generateNumber(max) {
    let curStr = "";
    let iter = 1;
    while(iter < max) {
        if(iter != 1) {
            curStr = curStr + ","+ iter;
        } else {
            curStr = iter;
        }
        
        iter = iter + 4;
    }
    console.log(curStr);
}
generateNumber(208);