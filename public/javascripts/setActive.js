
/*Aim fo this fucntion is to set the active navigation bar elemenet

	inspired by [12] http://www.cssnewbie.com/intelligent-navigation/
*/

function setActive() {
  	aObj = document.getElementById('nav').getElementsByTagName('a');	//get all <a> tags within <nav>
  	for(i=0;i<aObj.length;i++) { 
    	if(document.location.href.indexOf(aObj[i].href)>=0) {
     		aObj[i].className='active';		//if active append active to specific tag (css handles the rest)
    	}
  	}
}
window.onload = setActive;