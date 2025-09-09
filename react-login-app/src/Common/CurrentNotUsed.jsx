// import React from "react";
//
// <div className="RecommendCourse" style={{ width: '90%', margin: '0 auto' }}> {/* 코스 추천 */}
//     <p className="IntroMent" style={{ fontSize: '18px', fontWeight: '500', marginTop: '38px', marginBottom: '18px' }}>
//         추천 받을 코스를 선택해보세요
//     </p>
//
//     <div className="Course" style={{ marginBottom: '100px' }}> {/* 코스 추천 버튼 -> 프리미엄, 가성비, 리조트, 감성 */}
//         {['프리미엄', '가성비', '리조트', '감성'].map(label => (
//             <button key={label} className={`CourseButton ${label}-btn`}>
//                 <div className="overlay"></div>
//                 <p>{label}</p>
//             </button>
//         ))}
//     </div>
// </div>



//     .Course {
//     display: grid;
//     grid-template-columns: repeat(2, 1fr);
//     gap: 10px;
//     padding: 0;
//     margin: 0 auto;
// }
//
// .CourseButton {
//     position: relative;
//     border: none;
//     cursor: pointer;
//     width: 100%;
//     padding-top: 38%; /* 너비 대비 높이비 */
//     background-size: cover;
//     background-position: center;
//     background-repeat: no-repeat;
//     transition: transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out;
//     display: block;
//     border-radius: 8px;
//     box-shadow: 0 0 6px rgba(18, 72, 46, 0.7);
// }
//
// .프리미엄-btn {
//     background-image: url('./Premium.svg');
// }
// .가성비-btn {
//     background-image: url('./ValueOfMoney.svg');
// }
// .리조트-btn {
//     background-image: url('./Resort.svg');
// }
// .감성-btn {
//     background-image: url('./Emotion.svg');
// }
//
// .CourseButton .overlay { /* 이미지 위에 그라데이션 오버레이 */
//     position: absolute;
//     top: 0;
//     left: 0;
//     width: 100%;
//     height: 100%;
//     border-radius: 8px;
//     opacity: 0.9;
//     background-image: linear-gradient(to right, rgba(255, 255, 255, 1) 28%, rgba(255, 255, 255, 0) 87%);
//     z-index: 1;
// }
//
// .CourseButton p {
//     position: absolute;
//     bottom: 10%;
//     left: 12px;
//     color: #12482E;
//     font-weight: bold;
//     z-index: 2;
//     margin: 0;
//     padding: 0;
// }
//
// .CourseButton:hover {
//     transform: scale(1.03);
// }