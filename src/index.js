// const express = require('express')  // -> CommonJS
import dotenv from "dotenv";
import express from 'express';          // -> ES Module
import cors from "cors";
import swaggerAutogen from "swagger-autogen";
import swaggerUiExpress from "swagger-ui-express";
import userRoutes from "./routes/user.routes.js";
import protectedRoutes from "./routes/protected.routes.js"; // 보호된 라우트 추가
import questionRoutes from "./routes/question.routes.js"; // 질문 라우트 추가


dotenv.config();

const app = express()
const port = process.env.PORT;



/**
 * 공통 응답을 사용할 수 있는 헬퍼 함수 등록 -> 모든 요청에서 실행되는 미들웨어 함수 
 */
app.use((req, res, next) => {
  res.success = (success) => {
    return res.json({ resultType: "SUCCESS", error: null, success });
  };

  res.error = ({ errorCode = "unknown", reason = null, data = null }) => {
    return res.json({
      resultType: "FAIL",
      error: { errorCode, reason, data },
      success: null,
    });
  };

  next();
});


app.use(cors());                            // cors 방식 허용
app.use(express.static('public'));          // 정적 파일 접근
app.use(express.json());                    // request의 본문을 json으로 해석할 수 있도록 함 (JSON 형태의 요청 body를 파싱하기 위함)
app.use(express.urlencoded({ extended: false })); // 단순 객체 문자열 형태로 본문 데이터 해석

//멤버 라우트
app.use('/api/users', userRoutes);
// 보호된 API
app.use("/api/protected", protectedRoutes);
// 질문 관련 라우트 추가
app.use("/api/questions", questionRoutes);


app.use(
    "/docs",
    swaggerUiExpress.serve,
    swaggerUiExpress.setup({}, {
      swaggerOptions: {
        url: "/openapi.json", // Swagger UI에서 사용할 JSON 문서 경로
      },
    })
);

app.get("/openapi.json", async (req, res, next) => {
  const options = {
    openapi: "3.0.0",
    disableLogs: true,
    writeOutputFile: false,
  };
  const outputFile = "/dev/null"; // 파일로 저장하지 않음
  const routes = [
    "./src/index.js",
    "./src/routes/user.routes.js",
    "./src/routes/protected.routes.js",
    "./src/routes/question.routes.js", // 질문 라우트 추가
  ];
  const doc = {
    info: {
      title: "team17",
      description: "team17 테스트 문서",
    },
    host: "localhost:3000",
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT", // JWT 형식
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  };

  const result = await swaggerAutogen(options)(outputFile, routes, doc);
  res.json(result ? result.data : null);
});




app.get('/', (req, res) => {
  res.send('Hello World!')
})

// 라우팅 코드 입력 부분 



/**
 * 전역 오류를 처리하기 위한 미들웨어 : 반드시 라우팅 마지막에 정의
 */
app.use((err, req, res, next) => { //
  if (res.headersSent) { //응답 헤더가 이미 전송되었으면 
    return next(err);
  }

  res.status(err.statusCode || 500).error({
    errorCode: err.errorCode || "unknown",
    reason: err.reason || err.message || null,
    data: err.data || null,
  });
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})