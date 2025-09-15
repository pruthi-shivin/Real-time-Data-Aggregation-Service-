import request from "supertest";
import express from "express";

const app = express();
app.use(express.json());

app.get("/api/tokens", (req, res) => {
  const { emptyCache, causeError, limit } = req.query;
  if (causeError === "true") return res.status(500).json({ error: "Simulated server error" });
  if (emptyCache === "true") return res.json([]);
  
  const tokens = [
    { name: "SOLANA", price: 236.22, volume: 4443.85 },
    { name: "BTC", price: 30000, volume: 123456 },
    { name: "ETH", price: 2000, volume: 98765 },
  ];
  
  if (limit) {
    const n = parseInt(limit as string, 10);
    const largeList = Array.from({ length: n }, (_, i) => ({ name: `TOKEN${i}`, price: i * 10, volume: i * 100 }));
    return res.json(largeList);
  }

  res.json(tokens);
});

describe("Token API Tests", () => {
  // ----------------- Happy Cases -----------------
  it("should return tokens array with length > 0", async () => {
    const res = await request(app).get("/api/tokens");
    expect(res.body.length).toBeGreaterThan(0);
  });

  it("first token should be SOLANA", async () => {
    const res = await request(app).get("/api/tokens");
    expect(res.body[0].name).toBe("SOLANA");
  });

  it("should contain BTC token", async () => {
    const res = await request(app).get("/api/tokens");
    const tokenNames = res.body.map((t: any) => t.name);
    expect(tokenNames).toContain("BTC");
  });

  it("should contain ETH token", async () => {
    const res = await request(app).get("/api/tokens");
    const tokenNames = res.body.map((t: any) => t.name);
    expect(tokenNames).toContain("ETH");
  });

  it("should return JSON content type", async () => {
    const res = await request(app).get("/api/tokens");
    expect(res.status).toBe(200);
    expect(res.headers["content-type"]).toMatch(/json/);
  });

  // ----------------- Edge Cases -----------------
  it("should return empty array if no tokens cached", async () => {
    const res = await request(app).get("/api/tokens?emptyCache=true");
    expect(res.status).toBe(200);
    expect(res.body).toEqual([]);
  });

  it("should handle invalid query parameters gracefully", async () => {
    const res = await request(app).get("/api/tokens?invalidParam=123");
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it("should handle very large token list", async () => {
    const res = await request(app).get("/api/tokens?limit=10000");
    expect(res.status).toBe(200);
    expect(res.body.length).toBe(10000);
  });

  it("should return error for invalid endpoint", async () => {
    const res = await request(app).get("/api/invalidEndpoint");
    expect(res.status).toBe(404);
  });

  it("should handle server error gracefully", async () => {
    const res = await request(app).get("/api/tokens?causeError=true");
    expect(res.status).toBe(500);
    expect(res.body.error).toBe("Simulated server error");
  });
});
