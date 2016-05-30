/*This function acts to get the last modified date
    
    Then breaks it down into date and time
    Perfomring the relevant formatting for the desired output

    inspired by [13] http://stackoverflow.com/questions/16024346/lastmodified-function-returns-current-date-and-time

*/

var modiDate = new Date(document.lastModified);
var showDate = modiDate.getDate() + "/" + (modiDate.getMonth() + 1) + "/" + modiDate.getFullYear();

if (modiDate.getSeconds() < 10) {
    secs = "0" + modiDate.getSeconds();
} else {
    secs = modiDate.getSeconds();
}

if (modiDate.getMinutes() < 10) {
    mins = "0" + modiDate.getMinutes();
} else {
    mins = modiDate.getMinutes();
}

if (modiDate.getHours() < 10) {
    hours = "0" + modiDate.getHours();
} else {
    hours = modiDate.getHours();
}

var showTime = hours + ":" + mins + ":" + secs;

document.write("This page was last updated on ");
document.write(showDate + " , at " + showTime);
//document.write(document.lastModified;

