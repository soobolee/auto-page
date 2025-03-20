# 🤖 Auto Page - Copy Cat your Web Surfing

<div align="center">

  ![icon](https://github.com/user-attachments/assets/f6121f9a-bcd0-4bec-978e-7eb5c3a69d15)
  <br />
  📸 [시연 영상 보러가기](https://youtu.be/OHQtxUwDZ5Q) | 
  📦 [다운로드 바로가기](https://www.auto-page.site)
  
</div>

Auto Page는 사용자의 웹 서핑 기록을 기억하고, 그 기록을 매크로처럼 다시 실행 해주는 프로젝트입니다.

브라우저와 비슷한 디자인으로 사용자에게 편안한 웹 서핑 환경을 제공하고, 매크로를 통해 반복적인 작업을 관리하여 사용자에게 편리함을 제공합니다.


<br />

## 목차

<!-- toc -->

- [1. 개발 동기](#1-%EA%B0%9C%EB%B0%9C-%EB%8F%99%EA%B8%B0)
- [2. 기능](#2-%EA%B8%B0%EB%8A%A5)
- [3. 기술 스택](#3-%EA%B8%B0%EC%88%A0-%EC%8A%A4%ED%83%9D)
- [4. 기술 스택에 대한 이해](#4-%EA%B8%B0%EC%88%A0-%EC%8A%A4%ED%83%9D%EC%97%90-%EB%8C%80%ED%95%9C-%EC%9D%B4%ED%95%B4)
  * [4-1. Electron을 선택한 이유](#4-1-electron%EC%9D%84-%EC%84%A0%ED%83%9D%ED%95%9C-%EC%9D%B4%EC%9C%A0)
    + [4-1-1. iframe을 이용한 접근 실패](#4-1-1-iframe%EC%9D%84-%EC%9D%B4%EC%9A%A9%ED%95%9C-%EC%A0%91%EA%B7%BC-%EC%8B%A4%ED%8C%A8)
    + [4-1-2. 크롤링을 이용한 접근 실패](#4-1-2-%ED%81%AC%EB%A1%A4%EB%A7%81%EC%9D%84-%EC%9D%B4%EC%9A%A9%ED%95%9C-%EC%A0%91%EA%B7%BC-%EC%8B%A4%ED%8C%A8)
    + [4-1-3. Electron을 이용한 접근 성공](#4-1-3-electron%EC%9D%84-%EC%9D%B4%EC%9A%A9%ED%95%9C-%EC%A0%91%EA%B7%BC-%EC%84%B1%EA%B3%B5)
  * [4-2. 전역 상태를 선택한 이유](#4-2-%EC%A0%84%EC%97%AD-%EC%83%81%ED%83%9C%EB%A5%BC-%EC%84%A0%ED%83%9D%ED%95%9C-%EC%9D%B4%EC%9C%A0)
- [5. 구현 사항](#5-%EA%B5%AC%ED%98%84-%EC%82%AC%ED%95%AD)
  * [5-1. 사용자 이벤트 기록하기](#5-1-%EC%82%AC%EC%9A%A9%EC%9E%90-%EC%9D%B4%EB%B2%A4%ED%8A%B8-%EA%B8%B0%EB%A1%9D%ED%95%98%EA%B8%B0)
    + [5-1-1. 이벤트 전파 방식 개선으로 정확한 이벤트 감지](#5-1-1-%EC%9D%B4%EB%B2%A4%ED%8A%B8-%EC%A0%84%ED%8C%8C-%EB%B0%A9%EC%8B%9D-%EA%B0%9C%EC%84%A0%EC%9C%BC%EB%A1%9C-%EC%A0%95%ED%99%95%ED%95%9C-%EC%9D%B4%EB%B2%A4%ED%8A%B8-%EA%B0%90%EC%A7%80)
    + [5-1-2. 사용자 이벤트와 스크립트 이벤트 구별하기](#5-1-2-%EC%82%AC%EC%9A%A9%EC%9E%90-%EC%9D%B4%EB%B2%A4%ED%8A%B8%EC%99%80-%EC%8A%A4%ED%81%AC%EB%A6%BD%ED%8A%B8-%EC%9D%B4%EB%B2%A4%ED%8A%B8-%EA%B5%AC%EB%B3%84%ED%95%98%EA%B8%B0)
    + [5-1-3. 이벤트 감지할 수 없는 iframe 삭제](#5-1-3-%EC%9D%B4%EB%B2%A4%ED%8A%B8-%EA%B0%90%EC%A7%80%ED%95%A0-%EC%88%98-%EC%97%86%EB%8A%94-iframe-%EC%82%AD%EC%A0%9C)
    + [5-1-4. 감지한 이벤트 요소 정보 기록하기](#5-1-4-%EA%B0%90%EC%A7%80%ED%95%9C-%EC%9D%B4%EB%B2%A4%ED%8A%B8-%EC%9A%94%EC%86%8C-%EC%A0%95%EB%B3%B4-%EA%B8%B0%EB%A1%9D%ED%95%98%EA%B8%B0)
  * [5-2. 사용자 이벤트를 기록한 매크로 실행하기](#5-2-%EC%82%AC%EC%9A%A9%EC%9E%90-%EC%9D%B4%EB%B2%A4%ED%8A%B8%EB%A5%BC-%EA%B8%B0%EB%A1%9D%ED%95%9C-%EB%A7%A4%ED%81%AC%EB%A1%9C-%EC%8B%A4%ED%96%89%ED%95%98%EA%B8%B0)
    + [5-2-1. SPA의 동적 렌더링 DOM 요소 찾기](#5-2-1-spa%EC%9D%98-%EB%8F%99%EC%A0%81-%EB%A0%8C%EB%8D%94%EB%A7%81-dom-%EC%9A%94%EC%86%8C-%EC%B0%BE%EA%B8%B0)
    + [5-2-2. 페이지 변경 시 preload 스크립트 초기화와 매크로 중지 문제?](#5-2-2-%ED%8E%98%EC%9D%B4%EC%A7%80-%EB%B3%80%EA%B2%BD-%EC%8B%9C-preload-%EC%8A%A4%ED%81%AC%EB%A6%BD%ED%8A%B8-%EC%B4%88%EA%B8%B0%ED%99%94%EC%99%80-%EB%A7%A4%ED%81%AC%EB%A1%9C-%EC%A4%91%EC%A7%80-%EB%AC%B8%EC%A0%9C)
  * [5-3. 다양한 에러 발생에 대한 처리](#5-3-%EB%8B%A4%EC%96%91%ED%95%9C-%EC%97%90%EB%9F%AC-%EB%B0%9C%EC%83%9D%EC%97%90-%EB%8C%80%ED%95%9C-%EC%B2%98%EB%A6%AC)
  * [5-4. 이벤트 발생 직후 시점 감지 및 이미지 캡쳐](#5-4-%EC%9D%B4%EB%B2%A4%ED%8A%B8-%EB%B0%9C%EC%83%9D-%EC%A7%81%ED%9B%84-%EC%8B%9C%EC%A0%90-%EA%B0%90%EC%A7%80-%EB%B0%8F-%EC%9D%B4%EB%AF%B8%EC%A7%80-%EC%BA%A1%EC%B3%90)
    + [```did-stop-loading``` 리스너의 문제점](#did-stop-loading-%EB%A6%AC%EC%8A%A4%EB%84%88%EC%9D%98-%EB%AC%B8%EC%A0%9C%EC%A0%90)
  * [5-5. HashRouter를 선택한 이유와 라우팅 문제 해결](#5-5-hashrouter%EB%A5%BC-%EC%84%A0%ED%83%9D%ED%95%9C-%EC%9D%B4%EC%9C%A0%EC%99%80-%EB%9D%BC%EC%9A%B0%ED%8C%85-%EB%AC%B8%EC%A0%9C-%ED%95%B4%EA%B2%B0)
  * [5-6. 입력값에 대한 암호화 처리](#5-6-%EC%9E%85%EB%A0%A5%EA%B0%92%EC%97%90-%EB%8C%80%ED%95%9C-%EC%95%94%ED%98%B8%ED%99%94-%EC%B2%98%EB%A6%AC)
- [6. 회고](#6-%ED%9A%8C%EA%B3%A0)
- [7. 일정](#7-%EC%9D%BC%EC%A0%95)
  * [프로젝트 기간: 2025년 2월 1일 ~ 진행 중](#%ED%94%84%EB%A1%9C%EC%A0%9D%ED%8A%B8-%EA%B8%B0%EA%B0%84-2025%EB%85%84-2%EC%9B%94-1%EC%9D%BC--%EC%A7%84%ED%96%89-%EC%A4%91)

<!-- tocstop -->

<br />

## 1. 개발 동기
반복적인 웹 작업이 지겹지 않으신가요?

Auto Page는 반복적인 웹 작업의 불편함을 해소하고자 시작된 프로젝트입니다.
평상 시 웹 서핑을 하다 보면 반복되는 업무 메일 확인, 출석체크 이벤트 등 매번 같은 작업을 진행해야 하는 불편함이 존재합니다.

[시중에는 이미 많은 매크로 프로그램이 배포](https://kmong.com/search?type=gigs&keyword=%EB%A7%A4%ED%81%AC%EB%A1%9C+%ED%94%84%EB%A1%9C%EA%B7%B8%EB%9E%A8)되어 있지만 특수 목적으로 제작 된 매크로들과, 일반 사용자가 설명서 없이 사용하기에는 어려운 매크로 등록, 또한 맞춤 제작을 통한 가격의 상승 등 이미 시중에 있는 프로그램들도 충분한 개선사항이 존재한다는 것을 알게 되었습니다.

"웹 서핑 하듯 사용하세요! Auto Page가 기록하고 실행해 줄게요." 라는 목표 아래 최대한 기존 브라우저와 비슷한 환경에서 사용자가 다양한 목적으로 쉽게 매크로를 쉽게 기록하고, 실행함으로써 더 중요한 업무에 집중할 수 있도록 설계하고 개발했습니다.

<br />

## 2. 기능
<div align="center">
  <table>
    <tr>
      <td width="60%">
        <img src="https://github.com/user-attachments/assets/b03ad453-5173-4624-b5e0-0802bae66412" />
      </td>
      <td width="40%">
        &#8251; 기존 브라우저와 비슷한 환경 제공 <br /><br />
        사용자가 매크로를 기록함에 어색함이 없도록 앞으로 가기/ 뒤로 가기 및 새로고침을 구현해 기존 브라우저와 비슷한 환경을 제공합니다.
      </td>
    </tr>
    <tr>
      <td>
        <img src="https://github.com/user-attachments/assets/dc68ffc6-465d-4594-8860-1707675cba53" />
      </td>
      <td>
        &#8251; 사용자 상호작용 기록 <br /><br />
        사용자의 클릭, 입력 요소에 대해 tagName, id  , class, url, href를 기록합니다.<br /><hr />
        &#8251; 이벤트 후 시점 캡처 <br /><br />
        사용자가 이해하기 쉽도록 이벤트 후의 변경사항이 반영된 화면을 캡쳐해 저장합니다.
      </td>
    </tr>
    <tr>
      <td>
        <img src="https://github.com/user-attachments/assets/ca5d6d86-a21c-4979-95c5-a3cb5252f0d9" />
      </td>
      <td>
        &#8251; 기록된 매크로를 실행 <br /><br />
        DOM이 다시 로드 되거나, 페이지가 이동해도 실행 순서는 보장됩니다.
      </td>
    </tr>
    <tr>
      <td>
        <img src="https://github.com/user-attachments/assets/2b3e2332-dd40-49eb-9797-b6e4a0b33a16" />
      </td>
      <td>
        &#8251; 매크로 북마크 지정 <br /><br />
        자주 사용하는 매크로를 북마크로 지정하여 모아볼 수 있습니다.<br /><hr />
        &#8251; 매크로 수정 및 삭제 <br /><br />
        매크로 각 단계 별로 타겟 요소를 수정 및 삭제할 수 있습니다.<br /><hr />
        &#8251; 매크로 단축키 등록 <br /><br />
        매크로에 단축키를 지정할 수 있고 빠른 실행이 가능합니다.
      </td>
    </tr>
  </table>
</div>

<br />

## 3. 기술 스택
<div align="center">
  
| 프레임워크 | 프론트엔드 | 빌드 | 테스트 | 배포 |
| ---------- | ---------------------------------------------- | ---------------------------------------------- | ---------------------------------------------- | ---------------------------------------------- | 
| [<img src="https://img.shields.io/badge/Electron-47848F?style=for-the-badge&logo=Electron&logoColor=white&"/>](https://www.electronjs.org/) | [<img src="https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=React&logoColor=white"/>](https://ko.react.dev/) <br /> [<img src="https://img.shields.io/badge/Tailwind-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white"/>](https://tailwindcss.com/) <br /> [<img src="https://img.shields.io/badge/Zustand-F56D2E?style=for-the-badge&logo=&logoColor=white"/>](https://zustand-demo.pmnd.rs/) | [<img src="https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white"/>](link=https://ko.vite.dev/) | [<img src="https://img.shields.io/badge/Vitest-6E9F18?style=for-the-badge&logo=vitest&logoColor=white"/>](https://vitest.dev/) | [<img src="https://img.shields.io/badge/Netlify-00C7B7?style=for-the-badge&logo=netlify&logoColor=white"/>](https://www.netlify.com/) <br /> [<img src="https://img.shields.io/badge/Electron Builder-3B4250?style=for-the-badge&logo=electronbuilder&logoColor=white"/>](https://www.electron.build/) |

</div>

<br />

## 4. 기술 스택에 대한 이해
### 4-1. Electron을 선택한 이유
Electron은 Chromium 프로젝트의 다중 프로세스 아키텍처를 상속 받아 node환경인 main프로세스와 webContents 환경인 renderer 프로세스를 사용합니다. 이 구조는 크롬과 같은 웹 브라우저와 작동 방식이 구조적으로 매우 유사하다고 생각이 들었습니다. 따라서 웹 브라우저와 구조적으로 비슷하다면 사용자가 클릭한 요소, 입력한 값 등  사용자가 발생시키는 이벤트에 접근할 수 있고, 매크로를 실행하기 위해 외부의 DOM에 접근할 수 있겠다는 생각이 Electron을 선택하는 계기가 되었습니다.

<div align="center">
  <img width="800" src="https://github.com/user-attachments/assets/9aaf08c1-7a66-467f-a2a5-ca4d84a298c4">
</div>

#### 4-1-1. iframe을 이용한 접근 실패
처음은 iframe을 통한 접근을 시도 했었습니다. ```iframeElement.contentWindow``` 를 통해 iframe 속 DOM에서 사용자의 이벤트를 감지하려 했지만 간과한 부분은 CORS에러로 사용자가 원하는 도메인을 띄울 수 없기 때문에 다시 방향을 틀어보고자 하였습니다. <br />

#### 4-1-2. 크롤링을 이용한 접근 실패
프록시 서버를 사용해 CORS를 우회하고자 하였습니다. ```Express.js```를 통해 크롤링 서버를 구축하였고,
크롤링을 통해 사용자가 요청한 도메인의 DOM이 로드 되면 해당 DOM을 문자열 형태로 반환받아 화면단에 뿌려주는 것을 목표로 하였고 CORS를 우회하여 사용자가 원했던 도메인을 호출하는데에 성공했습니다. <br />
하지만 이 방법의 한계로 사용자가 다음 페이지로 넘어가거나, 페이지 전환 시마다 요청을 막고 크롤링 서버로 보내다 보니 응답을 기다리는 시간이 길어졌고 사용자 친화적이지 않다는 생각을 하게 되었습니다.

#### 4-1-3. Electron을 이용한 접근 성공
앞의 방법들을 시도해 보면서 CORS, 사용자 친화성, 이벤트 감지 및 전달이 최우선이라고 느꼈고, 문제들을 해결하기 위해 다중 프로세스인 Electron이 최적이라고 생각했습니다.<br />
Electron은 main 및 renderer라는 두 가지 유형의 독립된 프로세스가 있고, renderer프로세스에 preload라는 node스크립트를 주입해 두 프로세스를 연결합니다.<br />
main 프로세스를 통해 외부 HTML을 호출하고 preload 스크립트를 통해 외부 DOM을 직접 조작하고, 사용자의 이벤트를 감지하는 것이 가능해졌습니다. 즉, Electron을 선택한 이유는 다음과 같습니다.<br />
1. CORS 문제 해결: 웹 브라우저 환경이 아닌 Electron에서 웹 컨텐츠를 호출 할 때 node.js인 main프로세스를 거쳐 호출되고 이는 서버 간의 호출이기 때문에 CORS 문제를 우회할 수 있었습니다.
2. 사용자 친화성: 페이지 전환 시 크롤링과는 다르게 기다릴 필요가 없고 Electron의 ```webview```태그를 통해 기존 브라우저와 같은 환경을 제공할 수 있었습니다.
3. 이벤트 감지 및 전달: preload를 ```webview```태그로 불러온 HTML에 주입해 이벤트를 감지하고 그 결과를 main 프로세스와 renderer 프로세스로 전달하기 용이했습니다.

<div align="center">

  <img width="800" src="https://github.com/user-attachments/assets/6ce19fbe-4946-4aa2-a7cc-aec893b2baaa">

</div>

### 4-2. 전역 상태를 선택한 이유
Auto Page프로젝트에서는 의존성이 생긴 각 이벤트들이 프로젝트의 중심 기능과 연결되어 있고 모든 이벤트의 흐름을 파악하고 이벤트 순서에 맞는 다음 로직을 이어나가야 했어서 **"이벤트의 순서를 제어하는 부모 컨트롤러"** 로써 전역상태를 선택하는 계기가 되었습니다.<br /><br />
Electron은 main, renderer 두 개의 프로세스가 존재하고, ipc[Inter-Process Communication] 통신을 사용합니다.<br />
통신 채널을 설정하고 이벤트 리스너로 등록 시켜놓으면 두 프로세스 간 양방향 통신이 가능해지는데, 이 때 특정 이벤트끼리의 순서가 보장되어야 하는 의존성이 생깁니다, 따라서 의존성이 생긴 이벤트들의 순서를 보장해 주기 위해선 "부모 컨트롤러"가 존재해야 한다는 생각이 들었습니다.<br />
Auto Page에서는 전역상태를 부모 컨트롤러로써 이용해 모든 이벤트의 결과를 수집하고 이벤트 순서를 통제하며 이벤트 결과에 따라 화면 캡쳐, 에러 팝업, 매크로 실행 등 앱의 흐름을 관리합니다.
```js
// useMacroStore.js
startMacroExecute: () => {
  set({isMacroExecuting: true});

   // 매크로 시작 이벤트가 실행됨과 동시에 main프로세스에 session을 변경하는 이벤트를 전달하는 IPC통신 처리
  window.electronAPI.changeSession(true);
},
```

<br />

## 5. 구현 사항

### 5-1. 사용자 이벤트 기록하기
사용자의 이벤트를 정확히 감지하고 기록하는 것은 매크로 실행의 정확성을 보장하는 데 매우 중요합니다. 이를 위해 document에 캡처링 방식으로 등록해 놓은 ```click```, ```change```, ```keydown``` 이벤트 리스너를 preload 스크립트에 작성 후 각 ```webview``` 태그에 이 preload 스크립트를 주입하여 main 프로세스와 renderer 프로세스에 전달하는 방법으로 사용자의 이벤트를 감지하고 기록했습니다.<br />

이벤트 감지를 제대로 하지 못한다면 기록된 이벤트를 재현하는 매크로 실행에 큰 오류를 야기할 수 있기 때문에 정확한 감지가 필수적이었습니다.<br />
이를 위해 우선 DOM에서 사용자와 상호작용할 수 있는 태그 요소를 찾았습니다. button, textarea, select, input, a 태그들이 있었고 해당 태그에서 발생하는 이벤트들을 감지해야 했습니다.<br />

다양한 이벤트가 존재함으로 [mdn 문서](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/change_event)를 참고하며, 하나하나 테스트를 통해 태그들이 어떤 이벤트에 반응하는지 찾았고, 이벤트를 감지하기 위해서는 총 3개 "CLICK", "CHANGE", "KEYDOWN" 이벤트가 필요했습니다.
<div align="center">
  
| 이벤트 | 감지되는 태그 |
| ---------- | ---------------------------------------------- |
| CLICK | ```button```, ```a```, ```input[type=button]``` |
| CHANGE | ```textarea```, ```select```, ```button```, ```input[type=text,password,number,email, 등 그 외]``` |
| KEYDOWN | ```Enter입력``` |

</div>

위 표와 같이 대부분의 이벤트는 CLICK, CHANGE로 잡아낼 수 있었으며, 보통 Enter키 이벤트가 걸려있는 검색창들은 KEYDOWN으로 대응했습니다.

#### 5-1-1. 이벤트 전파 방식 개선으로 정확한 이벤트 감지
이벤트가 document까지 전달되지 않는 문제를 해결하기 위해 캡쳐링 전파 방식을 사용했습니다.<br />
```js
document.addEventListener("click", (event) => {
  const aTag = event.target.closest("a");
  const buttonTag = event.target.closest("button");
}, true)
```
일부 요소들은 자체적으로 클릭 이벤트 핸들러를 가지고 있을 수 있고, 이 핸들러에서 ```event.stopPropagation()```을 사용해서 이벤트 버블링을 중단시킬 수 있기 때문에 document에 이벤트를 걸어 target을 찾는데 어려움이 있엇습니다.<br />
이를 위해 이벤트를 감지할 때 캡쳐링 전파 방식을 사용했습니다. 기존 버블링 전파 방식에서 캡쳐링을 통해 위에서 아래로 이벤트를 흐르게 하고, ```event.closest()```를 사용해 부모 요소를 탐색하면서 정확히 이벤트가 발생한 ```button```, ```a``` 요소들을 수집할 수 있었습니다.

#### 5-1-2. 사용자 이벤트와 스크립트 이벤트 구별하기
사용자가 발생시킨 이벤트만을 기록하기 위해 ```Event.isTrusted```와 타임스탬프 비교 방식을 사용했습니다.

<div align="center">

  <img width="551" src="https://github.com/user-attachments/assets/e2816144-8c2a-453a-9d5c-5a35cbcee8c6" />

</div>

전체 동의 버튼을 누르면 스크립트에 의해서 아래 체크박스 또한 모두 체크됩니다. 만약 이런 사용자에 의한 이벤트가 아닌 스크립트에 의한 이벤트까지도 감지하고, 기록한다면 매크로 실행 시 체크 된 체크박스를 다시 체크 해제하는 등의 문제가 생길 수 있습니다.<br /><br />
이런 측면에서 사용자에 의해 발생한 이벤트만 기록을 해야 했고, 이를 위해 Event의 [isTrusted](https://dom.spec.whatwg.org/#dom-event-istrusted) 속성을 활용하여 사용자가 직접 발생시킨 이벤트만을 기록했습니다.<br /><br />
다만 [isTrusted](https://dom.spec.whatwg.org/#dom-event-istrusted)의 공식 명세를 확인했을 때 click()메서드는 판별할 수 없고, 타임스탬프 기준으로 사용자 이벤트를 판별하는 것이라, 이러한 예외에 대응하기 위해 사용자의 직전 이벤트와 현재 이벤트의 시간을 비교하여 0.5초 이내로 발생 시 사람이 아닌 스크립트에 의한 이벤트라고 판별하여 기록하지 않기로 했고, 스크립트에 의한 이벤트들을 기록하지 않을 수 있었습니다.
```js
if (event.isTrusted) {
  const currentTimestamp = Date.now();
  if (currentTimestamp - lastEventTimestamp < 500) {
    return;
  }

  lastEventTimestamp = currentTimestamp;
}
```

#### 5-1-3. 이벤트 감지할 수 없는 iframe 삭제<br />
사용자가 웹 페이지를 사용할 수 있기 전 부터 iframe을 볼 수 없어야 했기 때문에 ```MutationObserver```를 활용하여 동적으로 로드되는 iframe을 모두 삭제해 사용자가 iframe과 상호작용할 수 없도록 막았습니다.
```js
const observer = new MutationObserver(() => {
  const iframe = document.getElementsByTagName("iframe");

  Array.from(iframe).forEach((frame) => {
    frame.remove();
  });
});
```
**iframe을 삭제한 이유** 는 main 프로세스를 통해 ```webview```를 띄우는 서버 간 요청으로 CORS에러를 회피했다고 하더라도, ```webview``` 속 iframe까지 CORS를 피하기에는 한계가 있다는 것을 알게됐습니다.<br />
따라서 CORS에러로 인해 Electron의 preload스크립트를 웹뷰에 주입했지만 웹뷰 속 iframe까지는 주입할 수 없었습니다. 따라서 iframe속 내용은 이벤트를 수집할 수 없었고, 사용자 오인을 방지하기 위해 iframe을 지워야 할 필요가 있었습니다.<br />
<br />

#### 5-1-4. 감지한 이벤트 요소 정보 기록하기
이벤트를 재현하기 위해선 감지한 이벤트에 대한 정보를 기록해 놓을 필요가 있었고, 이벤트에 대한 정보로 ```id```, ```class```, ```tagName```,속성과 요소의 위치를 알 수 있는 ```index```를 저장했습니다.<br />
```js
{
  method: "change",
  id: "input_item_id",
  tagName: "INPUT",
  tagIndex: "0",
  class: [
    {className: "input_item_id", classIndex, 0}
  ],
  url: "https://www.naver.com",
  href: "",
  value: "my id",
}
```
각 요소에 중복되지 않는 id가 할당되어 있다면 기록이 수월하겠지만, 실제로는 **id가 없는 경우**나 **class가 중복되는 경우** 등 다양한 예외가 발생할 수 있습니다. 이런 예외 상황에 대응하기 위해서는 이벤트 요소에 대한 다양한 정보를 수집해야 했습니다.<br /><br />
DOM상에서 위치를 기반으로 하는 xPath를 사용하면, DOM 구조가 변경되었을 때 매크로 실행에 큰 문제가 될 수 있습니다. 반면, id, class, tagName 같은 속성은 그 이름이 의미하는 바가 있어, 구조가 변경되어도 비교적 안정적으로 매크로를 실행할 수 있고 유연성을 제공할 수 있다고 판단했습니다.<br /><br />
또한 이벤트를 재현할 때 도움을 줄 수 있는 이벤트 종류와 이벤트가 발생한 ```url```, 이벤트의 목적지인 ```href```, 사용자가 입력한 값 ```value```를 포함한 추가 정보를 수집하여 JSON 형태로 node환경인 main 프로세스의 ```fs[file system]```객체를 사용해 프로젝트 디렉토리에 매크로를 저장했습니다.
<br />

### 5-2. 사용자 이벤트를 기록한 매크로 실행하기
이벤트를 다시 재현하기 위해서 기록해 놓았던 속성들을 이용해 이벤트가 발생 했던 타겟 요소를 찾아야 합니다.<br />
아래 코드와 같이 저장해 놓았던 url과 현재 페이지의 url을 비교하여 이벤트가 발생했던 url이 아니라면 먼저 이벤트가 발생한 url로 이동시키고 저장해 둔 ```id```, ```class```,```tagName```과 ```index```를 통해 이벤트가 발생했던 요소를 찾아주었습니다.
```js
if (location.href !== stageInfo.url) {
  // ... 코드 생략
  location.href = stageInfo.url;
  return;
}

if (document.querySelectorAll(selector)[index]) {
  targetElement = document.querySelectorAll(selector)[index];
}
```
타겟 요소를 찾게 되면 발생했던 이벤트의 종류에 따라 맞는 이벤트를 재현해 주었습니다.<br />
<div align="center">
  <table>
    <tr>
      <th>이벤트</th>
      <th>이벤트 재현 방식</th>
    </tr>
    <tr>
      <th>CLICK</th>
      <td>HTMLElement.click();</td>
    </tr>
    <tr>
      <th>CHANGE</th>
      <td>HTMLElement.value = value;</td>
    </tr>
    <tr>
      <th>KEYDOWN</th>
      <td>HTMLElement.focus();<br />webviewElement.sendInputEvent({type: "keyDown", keyCode: "Enter"});<br />webviewElement.sendInputEvent({type: "char", keyCode: "Enter"});<br />webviewElement.sendInputEvent({type: "keyUp", keyCode: "Enter"});</td>
    </tr>
  </table>
</div>

- CLICK 이벤트<br />
  ```click()``` 메서드를 사용했습니다.
- CHANGE 이벤트<br />
  input 타입의 변경이 일어난 것으로 value의 변경된 값을 할당했습니다.
- KEYDOWN 이벤트<br />
  Enter를 입력한 것으로 Electron의 ```sendInputEvent()```를 사용해 실제 키보드를 통해 이벤트가 발생한 것처럼 Enter 키 코드를 보내고 사용자가 직접 입력한 것처럼 모방해 봇 감지를 피할 수 있었습니다.

초기에는 기록된 매크로를 순회하며 타겟 요소를 찾고 저장한 이벤트를 그대로 다시 실행시켜주는 방식의 구현이었지만 테스트를 해보며 요소를 찾지 못하거나, 매크로가 일찍 종료되거나, 순서가 보장되지 않는 등 예상과는 다르게 동작하는 것을 발견했고. 총 두 가지의 문제점이 발견됐습니다.<br />

1. SPA페이지일 경우 컨텐츠들이 동적으로 생성 되기 때문에 실행 초기에는 이벤트가 발생했던 타겟 요소를 찾지 못하는 문제
2. ```a tag```를 통해 페이지가 전환되면 매크로가 실행 중인 preload스크립트가 재실행되는 문제
<br />

이를 해결하기 위해 기록된 매크로 요소를 SPA의 동적 렌더링에서 찾을 수 있어야 했고, 실행 중이던 preload스크립트가 초기화 되더라도 중단된 부분부터 순서를 보장해, 다시 실행시켜야 했습니다.

#### 5-2-1. SPA의 동적 렌더링 DOM 요소 찾기
페이지가 로딩되는 시간을 약 1.5초라고 가정하고 반복을 0.1초 단위로 반복하며 이벤트가 발생했던 타겟 요소를 찾는 것으로 SPA 방식에서 이벤트가 발생했던 타겟을 찾을 수 있었습니다.<br /><br />
기존에는 ```dom-ready``` 리스너를 사용해서 dom이 로드가 완료 되었을 시 이벤트에 해당하는 요소를 찾아 실행했지만 SPA는 ```dom-ready```이후 동적으로 DOM이 다시 구성되기 때문에 DOM이 구성되기 전에는 찾을 수 없었습니다.<br />
이를 위해 DOM변화가 감지되면 이벤트에 대상이 되는 타겟을 찾도록 ```MutationObserver```로 SPA 페이지에서 동적 요소들을 감지해낼 수 있었지만, 구성 속도에 따라 무한대기 해야하는 이슈가 생겼습니다.<br /><br />
그래서 사용자가 불편함을 느낄만한 시간대를 직접 체크해 봤으며, [최대 로드 시간 2.5초 이내가 사용자에게 좋은 경험을 줄 수 있다](https://developers.google.com/speed/docs/insights/v5/about?hl=ko)는 것을 알게되었고, 1초의 제한시간을 두고 쓰레드를 점유하고 타겟 요소를 찾는 while문을 구현했고, 요소가 동적으로 추가되는 시간을 고려해 100ms 간격으로 반복하도록 했습니다. Id, Class, TagName을 모두 사용하여 타겟 요소를 찾고 Id, Class가 없는 경우도 존재하기 때문에 평균적으로 사용자가 동적 요소를 찾는데 까지의 시간은 2초가 소요 됩니다.
```js
const start = Date.now();

while (!targetElement && Date.now() - start < 1000) {
  targetElement = document.querySelectorAll(selector)[index];
  await sleep(100);
} 
```
<br />
  
#### 5-2-2. 페이지 변경 시 preload 스크립트 초기화와 매크로 중지 문제?
```beforeunload```리스너를 걸어 해당 리스너가 감지되면, 매크로 실행을 멈추고, IPC통신을 통해 renderer 프로세스에 매크로가 중지된 시점의 배열인 ```restStageList```를 보내준 후 renderer 프로세스에서는 전달 받은 배열을 sessionStorage에 담아준 후 ```webview```의 ```dom-ready```를 다시 감지하여 다시 매크로 배열을 전달해 중단 된 매크로 단계부터 다시 실행하도록 해결했습니다.

이렇게 복잡하게 해결 해야 했던 이유는 매크로 실행 중 ```a```태그로 인해 페이지가 변경 될 경우 웹뷰에 주입해 놓았던 preload가 재실행 되면서 진행 중이던 매크로가 끊기게 되고 React의 매크로가 실행 중인지를 판별하는 상태는 업데이트가 되지 않아 두 프로세스 간 서로 상태 동기화가 되지 않는 문제가 있었기 때문입니다.<br /><br />
그래서 preload와 renderer프로세스의 React 상태를 동기화 시켜줄 필요가 있다고 생각했습니다. 페이지가 변경될 수 있는 preload에는 배열을 순회할 때마다 ```restStageList.shift();```를 통해 이미 실행된 매크로를 제거해주었고, ```beforeunload```리스너를 걸어 해당 리스너가 감지되면, 매크로 실행을 멈추고, IPC통신으로 renderer프로세스로 매크로가 중지된 시점의 배열인 ```restStageList```를 보내주었습니다.
```js
// preload/main.js 송신 측
const unloadEvent = () => {
  window.removeEventListener("beforeunload", unloadEvent);
  macroBreak = true;
  ipcRenderer.sendToHost("macro-stop", restStageList);
};

window.addEventListener("beforeunload", unloadEvent);
```

<br />
renderer프로세스에서는 preload에서 보낸 이벤트를 수신하여 정지된 시점에 매크로 배열을 sessionStorage에 담아주었습니다.

```js
// WebView.js 수신 측
if (event.channel === "macro-stop") {
  window.sessionStorage.setItem("resumeMacroList", JSON.stringify(event.args[0]));
}
```

<br />

그 후 웹뷰에 다시 preload의 ```dom-ready```가 감지되면 현재 매크로가 실행 중이었는지를 확인하고, sessionStorage에 넣었던 매크로 리스트를 파싱하여 preload에 매크로가 다시 실행돼야 한다는 IPC를 보내 서로 프로세스가 다른 preload와 renderer의 상태를 동기화했습니다.

```js
// WebView.js 매크로 재실행
const handleDomReady = () => {
  if (isMacroExecuting) {
    const resumeMacroList = window.sessionStorage.getItem("resumeMacroList");
    window.sessionStorage.removeItem("resumeMacroList");

    const parseResumeMacroList = JSON.parse(resumeMacroList);

    if (parseResumeMacroList && parseResumeMacroList.length > 0) {
      webViewRef.current.send("auto-macro", parseResumeMacroList);
    } else {
      webViewRef.current.send("auto-macro", macroStageList);
    }
  }
};
```

### 5-3. 다양한 에러 발생에 대한 처리
각 에러 처리에 대한 문구를 한 번에 관리하고 저장할 수 있는 상수 파일을 하나 생성했고 각각의 상수가 특정한 에러를 나타내고 코드 내에서 객체의 형태로 일관되게 처리될 수 있는 ENUM 개념을 적용하고 추후 상수의 데이터 불변성을 유지하기 위해 ```freeze``` 메서드를 통해 상수의 값을 수정할 수 없도록 했습니다.

Auto Page 프로젝트는 사용자의 행동을 기반으로 웹 서핑을 기록하고, 재실행하는 기능을 제공하고 기록을 File System에 저장 및 삭제 그리고 불러오기 기능을 제공하기 때문에 다양햔 사용자의 입력과 환경에 변화에 의해 여러가지 에러가 발생할 가능성이 있다고 생각했기 때문입니다.<br />

또한 발생할 수 있는 에러의 종류가 많아 각 컴포넌트 별로 각 에러에 대한 문구 및 처리 방법을 정해 놓으면 매번 해당 문구를 어디에 적어 놓았는지 찾아야 하기 때문에 유지보수적으로 좋지 않다고 생각 되어 하나의 상수 파일로 에러처리에 대한 문구들을 저장해 놓고 하나의 모달 컴포넌트에서 재사용하는 방식을 사용했습니다.
```js
// 에러 처리 문구
export const ALERT_ERROR_LOAD = {
  TITLE: "매크로를 불러오는 중 오류가 발생했습니다.",
  TEXT: "앱을 다시 실행해 주세요.",
  ICON: faCircleExclamation,
};

export const ALERT_ERROR_URL = {
  TITLE: "URL을 불러오는 중 실패했습니다.",
  TEXT: "정확한 URL인지 다시 확인해주세요.",
  ICON: faCircleExclamation,
};

Object.freeze(ALERT_ERROR_LOAD);
Object.freeze(ALERT_ERROR_URL);

// 에처 처리 모달 컴포넌트
<p className="text-3xl">{modalContent.TITLE}</p>
<p className="text-lg text-gray-700">{modalContent.TEXT}</p>
<span className="text-8xl m-5">
  <FontAwesomeIcon icon={modalContent.ICON} />
</span>
```

### 5-4. 이벤트 발생 직후 시점 감지 및 이미지 캡쳐
Auto Page에서는 사용자가 매크로를 기록하거나 수정할 때 해당 이벤트로 화면에 어떤 변화가 있었는지 쉽게 기억할 수 있도록 이벤트 직후 시점을 이미지로 남겨야 했습니다. 따라서, 이벤트가 발생한 후의 시점을 정확히 감지해야 했고, ```did-stop-loading``` 리스너를 사용해 이벤트 발생 직후 시점을 감지하고 이미지를 캡처할 수 있도록 했습니다.<br /><br />
```did-stop-loading```이벤트를 사용해야 했던 이유는 클릭이나, 입력 등 현재 페이지 내에서 일어나는 이벤트의 발생 직후는 캐치하기 쉬웠지만, 이벤트가 페이지 전환을 유발하거나 새로운 페이지를 띄울 때는 페이지 로딩 시간과 캡쳐 시점의 문제로 빈 화면이 캡쳐되는 이슈가 있었습니다.

<div align="center">
  <img width="174" alt="스크린샷 2025-03-03 오전 4 40 00" src="https://github.com/user-attachments/assets/da9c4eb0-54a8-462c-930b-a4449aed3e57" />
</div>

이 문제를 해결하기 위해 ```did-stop-loading``` 리스너를 사용해 페이지가 로드된 시점을 감지하고, 그 후에 이미지를 캡처하도록 했습니다.

#### ```did-stop-loading``` 리스너의 문제점
```did-stop-loading```리스너가 감지되는 시점은 브라우저의 favicon이 로딩 스피너로 바뀌는 시점과 동일합니다. 그 말은 favicon이 로딩하는 시점이 결국 이벤트가 감지되는 시점인데, favicon은 네트워크 요청을 보내거나, img, video같은 리소스를 받아올 때도 이벤트가 감지됩니다.<br />
그에 따라 이벤트가 발생할 때 마다 화면이 캡쳐되는 문제가 발생했고, 이를 제어할 필요가 있었습니다. 동시에 여러개의 이벤트가 등록될 가능성이 있어 매번 이벤트 실행 시마다 removeEventListener를 통해 한 개의 이벤트만 존재할 수 있도록 했고 **디바운싱**을 적용해 마지막 ```did-stop-loading```을 기다린 후 이미지를 촬영했습니다.
```js
currentWebview.removeEventListener("did-stop-loading", captureLoadedPage);

if (timerObject) {
  clearTimeout(timerObject);
}

timerObject = setTimeout(() => {
  window.sessionStorage.setItem("isEvent", false);
  capturePage();
}, 500);
```

<br />

### 5-5. HashRouter를 선택한 이유와 라우팅 문제 해결
Auto Page는 BrowserRouter가 아닌 HashRouter를 사용합니다. 그 이유는 BrowserRouter를 사용할 경우 Electron의 파일 프로토콜[```file://```] 환경에서 라우팅 문제가 발생하기 때문입니다.<br /><br />
Electron은 기본적으로 HTML파일을 로드할 때 main 프로세스의 node 환경에서 파일 프로토콜[```file://```]을 사용하여 Renderer 프로세스에 HTML을 로드하는 정적 서버를 구성하고 있기 때문에 BrowserRouter를 사용하게 되면 라우팅이 되지 않아 빌드 과정에서 흰 화면이 뜨는 이슈가 발생했습니다.<br /><br />
BrowserRouter는 history API를 사용하여 URL을 관리하고, 클라이언트 측 이동이 발생했을 때 history에 들어있는 URL 경로를 통해 요청한 컴포넌트의 경로를 요청하기 때문에 Electron 앱애서 BrowserRouter를 통한 라우팅을 사용하면 다음과 같은 상황이 벌어집니다.<br />
Electron은 파일 프로토콜[```file://```]을 사용하기 때문에 BrowserRouter는 사용자의 로컬 환경에서 ```index.html/macro```라는 파일을 찾으려고 시도할 것입니다.
```js
"file://localhost:3000/index.html/macro";
```
Electron이 파일 프로토콜[```file://```]을 사용한다는 것을 인지한 상태로 다른 대안을 찾아 봐야 했습니다.<br />

그렇게 찾은 대안으로는 HashRouter가 있었습니다, Hash Router는 라우팅 처리 시 아래 처럼 URL의 해시 부분을 기준으로 라우팅을 처리합니다.<br />
```js
"file://localhost:3000/#/index.html/macro";
```
HashRouter의 경우 ```#```을 통해 요청이 서버로 전달되지 않게 됩니다. 따라서, 파일 프로토콜을 사용한다고 해도 사용자 로컬에서 파일을 찾아 404를 반환하지 않을 수 있었고, HashRouter를 통해 클라이언트 환경에서 라우팅을 처리해 라우팅 문제를 해결했습니다.

### 5-6. 입력값에 대한 암호화 처리
Auto Page 프로젝트에서는 기록된 매크로를 재실행할 때 사용자의 입력값도 함께 기록해야만 이벤트 실행의 정확성을 보장할 수 있었습니다. 이러한 입력값에는 사용자의 ID와 비밀번호와 같은 민감한 정보가 포함될 수 있기 때문에, 모든 입력값을 암호화할 필요가 있었습니다. ID와 비밀번호를 판별할 수 없기 때문에 모든 입력값에 대해 양방향 암호화(AES-256-CBC) 방식을 사용하여 데이터의 보안을 강화했습니다. <br /><br />

양방향 암호화(AES-256-CBC)를 선택한 이유는 암호화와 복호화가 가능해야 했고 대칭키 알고리즘 중 DES의 상위 버전으로 256비트 키를 사용하고, CBC모드인 블록 암호화 통해 암호화 블록이 각 의존성을 제공하기 때문에 앞 블록이 IV에 의해 랜덤하게 변경 될 경우 뒷 블록 또한 값이 매번 변경되어 안정성을 제공할 수 있기 때문입니다.

암호화에 필요한 키와 초기화 벡터(IV)는 사용자 로컬에 저장하였습니다. 키를 사용자 로컬에 저장한 이유는 Auto Page가 일렉트론 앱으로 사용자 컴퓨터에서 작동하며, 암호화와 복호화가 외부 서버 없이 내부의 node 환경에서만 이루어지기 때문에 키를 로컬에 저장해도 안전성을 보장할 수 있다고 판단했기 때문입니다.<br />
```js
function encrypt(text) {
  const algorithm = "aes-256-cbc";
  const key = fs.readFileSync(join(app.getPath("userData"), "CRYPT_KEY"));
  const iv = fs.readFileSync(join(app.getPath("userData"), "CRYPT_IV"));

  const cipher = crypto.createCipheriv(algorithm, key, iv);
  let encrypted = cipher.update(text, "utf8", "hex");
  encrypted += cipher.final("hex");

  return encrypted;
}
```
1. 먼저 AES-256-CBC 알고리즘을 설정하고, 키와 IV를 사용자 데이터 디렉터리에서 읽어옵니다.
2. ```crypto.createCipheriv``` 함수를 사용하여 암호화 객체를 생성하고, 주어진 텍스트를 암호화한 후 hex 형식으로 변환하여 반환합니다.
3. 복호화 과정도 비슷하게 진행되며, ```AES-256-CBC``` 알고리즘을 설정하고, 키와 IV를 사용자 디렉토리에서 읽어온 후 ```crypto.createDecipheriv``` 메서드를 사용하여 복호화 객체를 생성합니다.
4. 암호화된 텍스트를 복호화하여 원래의 utf8 형식으로 변환하고 반환합니다.

## 6. 회고
Auto Page는 그 동안 혼자 진행 했던 프로젝트와 다르게 실제로 사용할 사람들의 입장에서 생각하며 개발한 첫 프로젝트였습니다.

개발자의 입장이 아닌 사용자의 입장에서 개발을 하게 되니 평소에는 생각하지 못했던 다양한 문제점들과 불편함을 발견하게 되었습니다. 이를 통해 사용자 경험(UX)의 중요성을 깨닫게 되었고, 기능 구현뿐만 아니라 사용자가 얼마나 편리하게 사용할 수 있는지에 대한 고민을 많이 하게 되었습니다.

또한, 프로젝트를 진행하면서 다양한 기술을 접하게 되었고, Electron 프레임워크를 통해 크로스 플랫폼 데스크톱 애플리케이션을 개발하는 경험을 쌓을 수 있었습니다. 크롤링, 이벤트 감지, DOM 조작 등 여러 기술적인 도전 과제들을 해결해 나가면서 많은 것을 배울 수 있었습니다.

이 프로젝트를 통해 얻은 가장 큰 교훈은 '사용자 중심의 개발'입니다. 내가 고생하면 고생할수록 사용자 사용성이 좋아진다는 것을 깨닫는 계기가 되었고, 앞으로도 사용자의 입장에서 생각하며 더 나은 서비스를 제공하기 위해 노력할 것입니다.

## 7. 일정
### 프로젝트 기간: 2025년 2월 1일 ~ 진행 중
> 2월 1일 ~ 2월 8일
> - PoC 진행

> 2월 9일 ~ 2월 28
> - 주요 기능 개발

> 2월 28일 ~ 진행 중
> - 리팩토링 진행, 유지보수

