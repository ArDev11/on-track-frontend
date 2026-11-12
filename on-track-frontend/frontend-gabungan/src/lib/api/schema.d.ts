/**
 * SEMENTARA: ditulis manual karena api/openapi.yaml belum ada di repository.
 * Ganti dengan `npm run gen:api` saat kontraknya tersedia.
 *
 * Path dan status berasal dari issue #45, #48, dan SAD. Yang berlabel ASUMSI
 * belum disebutkan di dokumen mana pun dan perlu dicocokkan dengan Backend.
 */

export interface ProblemDetails {
  type?: string;
  title: string;
  status: number;
  detail?: string;
  instance?: string;
  /** ASUMSI: sisa percobaan login, untuk pesan di layar W25. */
  remaining_attempts?: number;
  /** ASUMSI: sisa waktu kunci dalam detik, untuk hitung mundur di layar W23. */
  retry_after?: number;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  /** ASUMSI: nama field JWT. */
  access_token: string;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  /** ASUMSI: nama kedua field ini. */
  token: string;
  new_password: string;
}

export interface paths {
  "/auth/login": {
    post: {
      requestBody: { content: { "application/json": LoginRequest } };
      responses: {
        200: { content: { "application/json": LoginResponse } };
        401: { content: { "application/problem+json": ProblemDetails } };
        423: { content: { "application/problem+json": ProblemDetails } };
      };
    };
  };
  "/auth/logout": {
    post: {
      responses: { 204: { content: never } };
    };
  };
  "/auth/password/forgot": {
    post: {
      requestBody: { content: { "application/json": ForgotPasswordRequest } };
      responses: { 202: { content: never } };
    };
  };
  "/auth/password/reset": {
    post: {
      requestBody: { content: { "application/json": ResetPasswordRequest } };
      responses: {
        204: { content: never };
        400: { content: { "application/problem+json": ProblemDetails } };
      };
    };
  };
}
