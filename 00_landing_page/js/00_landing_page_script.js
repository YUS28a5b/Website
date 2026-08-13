console.log("자바스크립트가 정상적으로 연결되었습니다.");

//1. 사용자의 브라우저 언어 감지 및 HTML lang 속성 설정
const userLanguage = navigator.language.substring(0, 2);
document.documentElement.lang = userLanguage;

//2. 사용자의 브라우저 언어에 따라 자동으로 해당 언어 페이지로 리디렉션
(function () {
	const saved = localStorage.getItem('lang');
	if (saved === 'en' || saved === 'kr') {
	window.location.replace('../' + saved + '/index.html');
	}
})();

//3. 언어 선택 시 로컬 스토리지에 저장하고 해당 언어 페이지로 이동
function selectLang(lang) {
	// 'Save this setting...' 체크박스 요소 가져오기
	const save = document.getElementById('save-pref').checked;

	// 체크되어 있으먄 브라우저에 선택한 언어 저장, 아니면 기록 삭제
	if (save) {
	localStorage.setItem('lang', lang);
	} else {
	localStorage.removeItem('lang');
	}
	
	// 해당 폴더의 메인 페이지로 이동
	window.location.href = '../' + lang + '/index.html';
}

//랜딩페이지 다 만들고 주석 풀기

/*
//3. 언어별로 다른 문구 보여주기
const titleElement = document.querySelector('h1');
const descriptionElement = document.querySelector('p');

if(userLanguage === 'ko') {
	titleElement.txtContent = "안녕하세요! 반갑습니다.";
    descriptionElement.txtContent = "브라우저 언어 설정이 '한국어'로 되어있습니다.";
} else if (userLanguage === 'ja') {
	titleElement.txtContent = "";
    descriptionElement.txtContent = "";
} else {
	//한국어나 일본어가 아닌 모든 외국어(영어 등) 디폴트 설정
	titleElement.txtContent = "Welcome!";
    descriptionElement.txtContent = "Your brower language is set to English (or other).";
}
*/

//잘 작동하는지 개발자 도구(콘솔)에서 확인용
console.log("감지된 브라우저 언어:", userLanguage);