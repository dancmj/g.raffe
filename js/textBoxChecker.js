function BoxValidation(element){
//    if (event.keyCode == 13){ 
//      console.log("Enter pressed.");
//    }
    if(element.keyCode==32 || element.keyCode==188 || element.keyCode==190 || element.keyCode==186 || element.keyCode==48){
        textValue='';
        return false;
    }else{
        return true;
    }
  
};

function isNumber(evt) {
    evt = (evt) ? evt : window.event;
    var charCode = (evt.which) ? evt.which : evt.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
        return false;
    }
    return true;
}