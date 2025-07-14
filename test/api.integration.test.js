const request = require("supertest");
const mongoose = require("mongoose");
const app = require("../index");
const path = require("path");

const Structure = require("../model/Structure");
const Content = require("../model/Content");
const Design = require("../model/Design");
const Finish = require("../model/Finish");
const Suitablefor = require("../model/Suitablefor");
const Vendor = require("../model/Vendor");
const Groupcode = require("../model/Groupcode");
const Color = require("../model/Color");
const Category = require("../model/Category");
const Substructure = require("../model/Substructure");
const Subfinish = require("../model/Subfinish");
const Subsuitable = require("../model/Subsuitable");
const Seo = require("../model/Seo");

const MODELS = [
  { name: "structure", Model: Structure },
  { name: "content", Model: Content },
  { name: "design", Model: Design },
  { name: "finish", Model: Finish },
  { name: "suitablefor", Model: Suitablefor },
  { name: "vendor", Model: Vendor },
  { name: "groupcode", Model: Groupcode },
  { name: "color", Model: Color },
];

if (!process.env.MONGODB_URI_TEST) {
  // eslint-disable-next-line no-console
  console.warn("Skipping integration tests: MONGODB_URI_TEST is not set.");
  describe("API Integration Tests", () => {
    test("skipped", () => {
      expect(true).toBe(true);
    });
  });
} else {
  describe("API Integration Tests", () => {
    let server;
    beforeAll(async () => {
      await mongoose.connect(process.env.MONGODB_URI_TEST);
      server = app.listen(0);
      for (const { Model } of MODELS) {
        await Model.deleteMany({});
      }
      await Category.deleteMany({});
      await Seo.deleteMany({});
    });
    afterAll(async () => {
      for (const { Model } of MODELS) {
        await Model.deleteMany({});
      }
      await Category.deleteMany({});
      await Seo.deleteMany({});
      await mongoose.connection.close();
      server.close();
    });

    // Structure
    describe("Structure", () => {
      let structureId;
      test("should create a structure", async () => {
        const res = await request(server)
          .post("/api/structure")
          .send({ name: "Test Structure" });
        expect(res.statusCode).toBe(201);
        expect(res.body.data).toHaveProperty("name", "Test Structure");
        structureId = res.body.data._id;
      });
      test("should get all structures", async () => {
        const res = await request(server).get("/api/structure");
        expect(res.statusCode).toBe(200);
        expect(Array.isArray(res.body.data)).toBe(true);
      });
      test("should get structure by id", async () => {
        const res = await request(server).get(`/api/structure/${structureId}`);
        expect(res.statusCode).toBe(200);
        expect(res.body.data).toHaveProperty("_id", structureId);
      });
      test("should update structure", async () => {
        const res = await request(server)
          .put(`/api/structure/${structureId}`)
          .send({ name: "Updated Structure" });
        expect(res.statusCode).toBe(200);
        expect(res.body.data).toHaveProperty("name", "Updated Structure");
      });
      test("should delete structure", async () => {
        const res = await request(server).delete(
          `/api/structure/${structureId}`
        );
        expect(res.statusCode).toBe(200);
        expect(res.body.message).toMatch(/deleted/i);
      });
    });

    // Content
    describe("Content", () => {
      let contentId;
      test("should create a content", async () => {
        const res = await request(server)
          .post("/api/content")
          .send({ name: "Test Content" });
        expect(res.statusCode).toBe(201);
        expect(res.body.data).toHaveProperty("name", "Test Content");
        contentId = res.body.data._id;
      });
      test("should get all contents", async () => {
        const res = await request(server).get("/api/content");
        expect(res.statusCode).toBe(200);
        expect(Array.isArray(res.body.data)).toBe(true);
      });
      test("should get content by id", async () => {
        const res = await request(server).get(`/api/content/${contentId}`);
        expect(res.statusCode).toBe(200);
        expect(res.body.data).toHaveProperty("_id", contentId);
      });
      test("should update content", async () => {
        const res = await request(server)
          .put(`/api/content/${contentId}`)
          .send({ name: "Updated Content" });
        expect(res.statusCode).toBe(200);
        expect(res.body.data).toHaveProperty("name", "Updated Content");
      });
      test("should delete content", async () => {
        const res = await request(server).delete(`/api/content/${contentId}`);
        expect(res.statusCode).toBe(200);
        expect(res.body.message).toMatch(/deleted/i);
      });
    });

    // Design
    describe("Design", () => {
      let designId;
      test("should create a design", async () => {
        const res = await request(server)
          .post("/api/design")
          .send({ name: "Test Design" });
        expect(res.statusCode).toBe(201);
        expect(res.body.data).toHaveProperty("name", "Test Design");
        designId = res.body.data._id;
      });
      test("should get all designs", async () => {
        const res = await request(server).get("/api/design");
        expect(res.statusCode).toBe(200);
        expect(Array.isArray(res.body.data)).toBe(true);
      });
      test("should get design by id", async () => {
        const res = await request(server).get(`/api/design/${designId}`);
        expect(res.statusCode).toBe(200);
        expect(res.body.data).toHaveProperty("_id", designId);
      });
      test("should update design", async () => {
        const res = await request(server)
          .put(`/api/design/${designId}`)
          .send({ name: "Updated Design" });
        expect(res.statusCode).toBe(200);
        expect(res.body.data).toHaveProperty("name", "Updated Design");
      });
      test("should delete design", async () => {
        const res = await request(server).delete(`/api/design/${designId}`);
        expect(res.statusCode).toBe(200);
        expect(res.body.message).toMatch(/deleted/i);
      });
    });

    // Finish
    describe("Finish", () => {
      let finishId;
      test("should create a finish", async () => {
        const res = await request(server)
          .post("/api/finish")
          .send({ name: "Test Finish" });
        expect(res.statusCode).toBe(201);
        expect(res.body.data).toHaveProperty("name", "Test Finish");
        finishId = res.body.data._id;
      });
      test("should get all finishes", async () => {
        const res = await request(server).get("/api/finish");
        expect(res.statusCode).toBe(200);
        expect(Array.isArray(res.body.data)).toBe(true);
      });
      test("should get finish by id", async () => {
        const res = await request(server).get(`/api/finish/${finishId}`);
        expect(res.statusCode).toBe(200);
        expect(res.body.data).toHaveProperty("_id", finishId);
      });
      test("should update finish", async () => {
        const res = await request(server)
          .put(`/api/finish/${finishId}`)
          .send({ name: "Updated Finish" });
        expect(res.statusCode).toBe(200);
        expect(res.body.data).toHaveProperty("name", "Updated Finish");
      });
      test("should delete finish", async () => {
        const res = await request(server).delete(`/api/finish/${finishId}`);
        expect(res.statusCode).toBe(200);
        expect(res.body.message).toMatch(/deleted/i);
      });
    });

    // Suitablefor
    describe("Suitablefor", () => {
      let suitableforId;
      test("should create a suitablefor", async () => {
        const res = await request(server)
          .post("/api/suitablefor")
          .send({ name: "Test Suitablefor" });
        expect(res.statusCode).toBe(201);
        expect(res.body.data).toHaveProperty("name", "Test Suitablefor");
        suitableforId = res.body.data._id;
      });
      test("should get all suitablefors", async () => {
        const res = await request(server).get("/api/suitablefor");
        expect(res.statusCode).toBe(200);
        expect(Array.isArray(res.body.data)).toBe(true);
      });
      test("should get suitablefor by id", async () => {
        const res = await request(server).get(
          `/api/suitablefor/${suitableforId}`
        );
        expect(res.statusCode).toBe(200);
        expect(res.body.data).toHaveProperty("_id", suitableforId);
      });
      test("should update suitablefor", async () => {
        const res = await request(server)
          .put(`/api/suitablefor/${suitableforId}`)
          .send({ name: "Updated Suitablefor" });
        expect(res.statusCode).toBe(200);
        expect(res.body.data).toHaveProperty("name", "Updated Suitablefor");
      });
      test("should delete suitablefor", async () => {
        const res = await request(server).delete(
          `/api/suitablefor/${suitableforId}`
        );
        expect(res.statusCode).toBe(200);
        expect(res.body.message).toMatch(/deleted/i);
      });
    });

    // Vendor
    describe("Vendor", () => {
      let vendorId;
      test("should create a vendor", async () => {
        const res = await request(server)
          .post("/api/vendor")
          .send({ name: "Test Vendor" });
        expect(res.statusCode).toBe(201);
        expect(res.body.data).toHaveProperty("name", "Test Vendor");
        vendorId = res.body.data._id;
      });
      test("should get all vendors", async () => {
        const res = await request(server).get("/api/vendor");
        expect(res.statusCode).toBe(200);
        expect(Array.isArray(res.body.data)).toBe(true);
      });
      test("should get vendor by id", async () => {
        const res = await request(server).get(`/api/vendor/${vendorId}`);
        expect(res.statusCode).toBe(200);
        expect(res.body.data).toHaveProperty("_id", vendorId);
      });
      test("should update vendor", async () => {
        const res = await request(server)
          .put(`/api/vendor/${vendorId}`)
          .send({ name: "Updated Vendor" });
        expect(res.statusCode).toBe(200);
        expect(res.body.data).toHaveProperty("name", "Updated Vendor");
      });
      test("should delete vendor", async () => {
        const res = await request(server).delete(`/api/vendor/${vendorId}`);
        expect(res.statusCode).toBe(200);
        expect(res.body.message).toMatch(/deleted/i);
      });
    });

    // Groupcode
    describe("Groupcode", () => {
      let groupcodeId;
      test("should create a groupcode", async () => {
        const res = await request(server)
          .post("/api/groupcode")
          .send({ name: "Test Groupcode" });
        expect(res.statusCode).toBe(201);
        expect(res.body.data).toHaveProperty("name", "Test Groupcode");
        groupcodeId = res.body.data._id;
      });
      test("should get all groupcodes", async () => {
        const res = await request(server).get("/api/groupcode");
        expect(res.statusCode).toBe(200);
        expect(Array.isArray(res.body.data)).toBe(true);
      });
      test("should get groupcode by id", async () => {
        const res = await request(server).get(`/api/groupcode/${groupcodeId}`);
        expect(res.statusCode).toBe(200);
        expect(res.body.data).toHaveProperty("_id", groupcodeId);
      });
      test("should update groupcode", async () => {
        const res = await request(server)
          .put(`/api/groupcode/${groupcodeId}`)
          .send({ name: "Updated Groupcode" });
        expect(res.statusCode).toBe(200);
        expect(res.body.data).toHaveProperty("name", "Updated Groupcode");
      });
      test("should delete groupcode", async () => {
        const res = await request(server).delete(
          `/api/groupcode/${groupcodeId}`
        );
        expect(res.statusCode).toBe(200);
        expect(res.body.message).toMatch(/deleted/i);
      });
    });

    // Color
    describe("Color", () => {
      let colorId;
      test("should create a color", async () => {
        const res = await request(server)
          .post("/api/color")
          .send({ name: "Test Color" });
        expect(res.statusCode).toBe(201);
        expect(res.body.data).toHaveProperty("name", "Test Color");
        colorId = res.body.data._id;
      });
      test("should get all colors", async () => {
        const res = await request(server).get("/api/color");
        expect(res.statusCode).toBe(200);
        expect(Array.isArray(res.body.data)).toBe(true);
      });
      test("should get color by id", async () => {
        const res = await request(server).get(`/api/color/${colorId}`);
        expect(res.statusCode).toBe(200);
        expect(res.body.data).toHaveProperty("_id", colorId);
      });
      test("should update color", async () => {
        const res = await request(server)
          .put(`/api/color/${colorId}`)
          .send({ name: "Updated Color" });
        expect(res.statusCode).toBe(200);
        expect(res.body.data).toHaveProperty("name", "Updated Color");
      });
      test("should delete color", async () => {
        const res = await request(server).delete(`/api/color/${colorId}`);
        expect(res.statusCode).toBe(200);
        expect(res.body.message).toMatch(/deleted/i);
      });
    });

    // Category (with image upload)
    let categoryId;
    test("should create a category", async () => {
      const res = await request(server)
        .post("/api/category")
        .field("name", "Test Category")
        .attach("image", path.join(__dirname, "test-image.png"));
      expect(res.statusCode).toBe(201);
      expect(res.body.data).toHaveProperty("name", "Test Category");
      categoryId = res.body.data._id;
    });
    test("should get all categories", async () => {
      const res = await request(server).get("/api/category");
      expect(res.statusCode).toBe(200);
      expect(Array.isArray(res.body.data)).toBe(true);
    });
    test("should get category by id", async () => {
      const res = await request(server).get(`/api/category/${categoryId}`);
      expect(res.statusCode).toBe(200);
      expect(res.body.data).toHaveProperty("_id", categoryId);
    });
    test("should update category", async () => {
      const res = await request(server)
        .put(`/api/category/${categoryId}`)
        .field("name", "Updated Category");
      expect(res.statusCode).toBe(200);
      expect(res.body.data).toHaveProperty("name", "Updated Category");
    });
    test("should delete category", async () => {
      const res = await request(server).delete(`/api/category/${categoryId}`);
      expect(res.statusCode).toBe(200);
      expect(res.body.message).toMatch(/deleted/i);
    });

    // ✅ Updated Product Test Block (only this part is modified)
    describe("Product", () => {
      let ids = {};
      let categoryId;

      function uniqueName(base) {
        return `${base} ${Date.now()}-${Math.floor(Math.random() * 10000)}`;
      }

      async function createReferences() {
        const categoryRes = await request(server)
          .post("/api/category")
          .field("name", uniqueName("Product Category"))
          .attach("image", path.join(__dirname, "test-image.png"));
        const category = categoryRes.body.data;

        const structure = (
          await request(server)
            .post("/api/structure")
            .send({ name: uniqueName("Structure") })
        ).body.data;
        const substructure = (
          await request(server)
            .post("/api/substructure")
            .send({
              name: uniqueName("Substructure"),
              structure: structure._id,
            })
        ).body.data;
        const content = (
          await request(server)
            .post("/api/content")
            .send({ name: uniqueName("Content") })
        ).body.data;
        const design = (
          await request(server)
            .post("/api/design")
            .send({ name: uniqueName("Design") })
        ).body.data;
        const finish = (
          await request(server)
            .post("/api/finish")
            .send({ name: uniqueName("Finish") })
        ).body.data;
        const subfinish = (
          await request(server)
            .post("/api/subfinish")
            .send({ name: uniqueName("Subfinish"), finish: finish._id })
        ).body.data;
        const suitablefor = (
          await request(server)
            .post("/api/suitablefor")
            .send({ name: uniqueName("Suitablefor") })
        ).body.data;
        const subsuitable = (
          await request(server)
            .post("/api/subsuitable")
            .send({
              name: uniqueName("Subsuitable"),
              suitablefor: suitablefor._id,
            })
        ).body.data;
        const vendor = (
          await request(server)
            .post("/api/vendor")
            .send({ name: uniqueName("Vendor") })
        ).body.data;
        const groupcode = (
          await request(server)
            .post("/api/groupcode")
            .send({ name: uniqueName("Groupcode") })
        ).body.data;
        const color = (
          await request(server)
            .post("/api/color")
            .send({ name: uniqueName("Color") })
        ).body.data;

        return {
          category,
          structure,
          substructure,
          content,
          design,
          finish,
          subfinish,
          suitablefor,
          subsuitable,
          vendor,
          groupcode,
          color,
        };
      }

      beforeEach(async () => {
        ids = await createReferences();
        categoryId = ids.category._id;
      });

      test("should create a product", async () => {
        const unique = uniqueName("Test Product");
        const res = await request(server)
          .post("/api/product")
          .field("name", unique)
          .field("category", categoryId)
          .field("structure", ids.structure._id)
          .field("substructure", ids.substructure._id)
          .field("content", ids.content._id)
          .field("design", ids.design._id)
          .field("finish", ids.finish._id)
          .field("subfinish", ids.subfinish._id)
          .field("suitablefor", ids.suitablefor._id)
          .field("subsuitable", ids.subsuitable._id)
          .field("vendor", ids.vendor._id)
          .field("groupcode", ids.groupcode._id)
          .field("color", ids.color._id)
          .attach("img", path.join(__dirname, "test-image.png"));

        if (res.statusCode !== 201) {
          console.error("Product creation failed:", res.body);
          console.error("Response status:", res.statusCode);
          console.error("Response headers:", res.headers);
        }
        expect(res.statusCode).toBe(201);
        expect(res.body.data).toHaveProperty("name", unique);
        expect(res.body.data.substructure._id).toBe(ids.substructure._id);
        expect(res.body.data.subfinish._id).toBe(ids.subfinish._id);
        expect(res.body.data.subsuitable._id).toBe(ids.subsuitable._id);
      });

      test("should get all products", async () => {
        const createRes = await request(server)
          .post("/api/product")
          .field("name", uniqueName("Test Product"))
          .field("category", categoryId)
          .field("structure", ids.structure._id)
          .field("substructure", ids.substructure._id)
          .field("content", ids.content._id)
          .field("design", ids.design._id)
          .field("finish", ids.finish._id)
          .field("subfinish", ids.subfinish._id)
          .field("suitablefor", ids.suitablefor._id)
          .field("subsuitable", ids.subsuitable._id)
          .field("vendor", ids.vendor._id)
          .field("groupcode", ids.groupcode._id)
          .field("color", ids.color._id)
          .attach("img", path.join(__dirname, "test-image.png"));

        const res = await request(server).get("/api/product?limit=1000");
        expect(res.statusCode).toBe(200);
        const found = res.body.data.find(
          (p) => String(p._id) === String(createRes.body.data._id)
        );
        expect(found).toBeDefined();
        expect(found.substructure._id).toBe(ids.substructure._id);
        expect(found.subfinish._id).toBe(ids.subfinish._id);
        expect(found.subsuitable._id).toBe(ids.subsuitable._id);
      });

      test("should get product by id", async () => {
        const createRes = await request(server)
          .post("/api/product")
          .field("name", uniqueName("Test Product"))
          .field("category", categoryId)
          .field("structure", ids.structure._id)
          .field("substructure", ids.substructure._id)
          .field("content", ids.content._id)
          .field("design", ids.design._id)
          .field("finish", ids.finish._id)
          .field("subfinish", ids.subfinish._id)
          .field("suitablefor", ids.suitablefor._id)
          .field("subsuitable", ids.subsuitable._id)
          .field("vendor", ids.vendor._id)
          .field("groupcode", ids.groupcode._id)
          .field("color", ids.color._id)
          .attach("img", path.join(__dirname, "test-image.png"));

        const res = await request(server).get(
          `/api/product/${createRes.body.data._id}`
        );
        expect(res.statusCode).toBe(200);
        expect(res.body.data.substructure._id).toBe(ids.substructure._id);
        expect(res.body.data.subfinish._id).toBe(ids.subfinish._id);
        expect(res.body.data.subsuitable._id).toBe(ids.subsuitable._id);
      });

      test("should update a product", async () => {
        const createRes = await request(server)
          .post("/api/product")
          .field("name", uniqueName("Test Product"))
          .field("category", categoryId)
          .field("structure", ids.structure._id)
          .field("substructure", ids.substructure._id)
          .field("content", ids.content._id)
          .field("design", ids.design._id)
          .field("finish", ids.finish._id)
          .field("subfinish", ids.subfinish._id)
          .field("suitablefor", ids.suitablefor._id)
          .field("subsuitable", ids.subsuitable._id)
          .field("vendor", ids.vendor._id)
          .field("groupcode", ids.groupcode._id)
          .field("color", ids.color._id)
          .attach("img", path.join(__dirname, "test-image.png"));

        const productId = createRes.body.data._id;
        const updatedName = uniqueName("Updated Product");

        const res = await request(server)
          .put(`/api/product/${productId}`)
          .field("name", updatedName)
          .field("category", categoryId)
          .field("structure", ids.structure._id)
          .field("substructure", ids.substructure._id)
          .field("content", ids.content._id)
          .field("design", ids.design._id)
          .field("finish", ids.finish._id)
          .field("subfinish", ids.subfinish._id)
          .field("suitablefor", ids.suitablefor._id)
          .field("subsuitable", ids.subsuitable._id)
          .field("vendor", ids.vendor._id)
          .field("groupcode", ids.groupcode._id)
          .field("color", ids.color._id)
          .attach("img", path.join(__dirname, "test-image.png"));

        expect(res.statusCode).toBe(200);
        expect(res.body.data.name).toBe(updatedName);
      });

      test("should delete a product", async () => {
        const createRes = await request(server)
          .post("/api/product")
          .field("name", uniqueName("Test Product"))
          .field("category", categoryId)
          .field("structure", ids.structure._id)
          .field("substructure", ids.substructure._id)
          .field("content", ids.content._id)
          .field("design", ids.design._id)
          .field("finish", ids.finish._id)
          .field("subfinish", ids.subfinish._id)
          .field("suitablefor", ids.suitablefor._id)
          .field("subsuitable", ids.subsuitable._id)
          .field("vendor", ids.vendor._id)
          .field("groupcode", ids.groupcode._id)
          .field("color", ids.color._id)
          .attach("img", path.join(__dirname, "test-image.png"));

        const productId = createRes.body.data._id;

        const res = await request(server).delete(`/api/product/${productId}`);
        expect(res.statusCode).toBe(200);
        expect(res.body.message).toMatch(/deleted/i);

        // Optionally, check that the product is really gone
        const getRes = await request(server).get(`/api/product/${productId}`);
        expect(getRes.statusCode).toBe(404);
      });
    });

    // Substructure, Subfinish, Subsuitable tests
    let structureId, finishId, suitableforId;
    beforeAll(async () => {
      // Create parent records for sub-models
      structureId = (
        await request(server)
          .post("/api/structure")
          .send({ name: "Parent Structure" })
      ).body.data._id;
      finishId = (
        await request(server)
          .post("/api/finish")
          .send({ name: "Parent Finish" })
      ).body.data._id;
      suitableforId = (
        await request(server)
          .post("/api/suitablefor")
          .send({ name: "Parent Suitable" })
      ).body.data._id;
    });

    describe("Substructure", () => {
      let subId;
      test("should fail to create with invalid structure ref", async () => {
        const res = await request(server).post("/api/substructure").send({
          name: "Substructure Invalid",
          structure: "000000000000000000000000",
        });
        expect(res.statusCode).toBe(400);
        expect(res.body.errors[0].msg).toMatch(/does not exist/);
      });
      test("should create with valid structure ref", async () => {
        const res = await request(server)
          .post("/api/substructure")
          .send({ name: "Substructure Valid", structure: structureId });
        expect(res.statusCode).toBe(201);
        expect(res.body.data).toHaveProperty("name", "Substructure Valid");
        subId = res.body.data._id;
      });
      test("should get all substructures", async () => {
        const res = await request(server).get("/api/substructure");
        expect(res.statusCode).toBe(200);
        expect(Array.isArray(res.body.data)).toBe(true);
      });
      test("should get substructure by id", async () => {
        const res = await request(server).get(`/api/substructure/${subId}`);
        expect(res.statusCode).toBe(200);
        expect(res.body.data).toHaveProperty("_id", subId);
      });
      test("should update substructure", async () => {
        const res = await request(server)
          .put(`/api/substructure/${subId}`)
          .send({ name: "Substructure Updated", structure: structureId });
        expect(res.statusCode).toBe(200);
        expect(res.body.data).toHaveProperty("name", "Substructure Updated");
      });
      test("should delete substructure", async () => {
        const res = await request(server).delete(`/api/substructure/${subId}`);
        expect(res.statusCode).toBe(200);
        expect(res.body.message).toMatch(/deleted/i);
      });
    });

    describe("Subfinish", () => {
      let subId;
      test("should fail to create with invalid finish ref", async () => {
        const res = await request(server).post("/api/subfinish").send({
          name: "Subfinish Invalid",
          finish: "000000000000000000000000",
        });
        expect(res.statusCode).toBe(400);
        expect(res.body.errors[0].msg).toMatch(/does not exist/);
      });
      test("should create with valid finish ref", async () => {
        const res = await request(server)
          .post("/api/subfinish")
          .send({ name: "Subfinish Valid", finish: finishId });
        expect(res.statusCode).toBe(201);
        expect(res.body.data).toHaveProperty("name", "Subfinish Valid");
        subId = res.body.data._id;
      });
      test("should get all subfinishes", async () => {
        const res = await request(server).get("/api/subfinish");
        expect(res.statusCode).toBe(200);
        expect(Array.isArray(res.body.data)).toBe(true);
      });
      test("should get subfinish by id", async () => {
        const res = await request(server).get(`/api/subfinish/${subId}`);
        expect(res.statusCode).toBe(200);
        expect(res.body.data).toHaveProperty("_id", subId);
      });
      test("should update subfinish", async () => {
        const res = await request(server)
          .put(`/api/subfinish/${subId}`)
          .send({ name: "Subfinish Updated", finish: finishId });
        expect(res.statusCode).toBe(200);
        expect(res.body.data).toHaveProperty("name", "Subfinish Updated");
      });
      test("should delete subfinish", async () => {
        const res = await request(server).delete(`/api/subfinish/${subId}`);
        expect(res.statusCode).toBe(200);
        expect(res.body.message).toMatch(/deleted/i);
      });
    });

    describe("Subsuitable", () => {
      let subId;
      test("should fail to create with invalid suitablefor ref", async () => {
        const res = await request(server).post("/api/subsuitable").send({
          name: "Subsuitable Invalid",
          suitablefor: "000000000000000000000000",
        });
        expect(res.statusCode).toBe(400);
        expect(res.body.errors[0].msg).toMatch(/does not exist/);
      });
      test("should create with valid suitablefor ref", async () => {
        const res = await request(server)
          .post("/api/subsuitable")
          .send({ name: "Subsuitable Valid", suitablefor: suitableforId });
        expect(res.statusCode).toBe(201);
        expect(res.body.data).toHaveProperty("name", "Subsuitable Valid");
        subId = res.body.data._id;
      });
      test("should get all subsuitables", async () => {
        const res = await request(server).get("/api/subsuitable");
        expect(res.statusCode).toBe(200);
        expect(Array.isArray(res.body.data)).toBe(true);
      });
      test("should get subsuitable by id", async () => {
        const res = await request(server).get(`/api/subsuitable/${subId}`);
        expect(res.statusCode).toBe(200);
        expect(res.body.data).toHaveProperty("_id", subId);
      });
      test("should update subsuitable", async () => {
        const res = await request(server)
          .put(`/api/subsuitable/${subId}`)
          .send({ name: "Subsuitable Updated", suitablefor: suitableforId });
        expect(res.statusCode).toBe(200);
        expect(res.body.data).toHaveProperty("name", "Subsuitable Updated");
      });
      test("should delete subsuitable", async () => {
        const res = await request(server).delete(`/api/subsuitable/${subId}`);
        expect(res.statusCode).toBe(200);
        expect(res.body.message).toMatch(/deleted/i);
      });
    });

    // SEO tests
    describe("SEO", () => {
      let seoId, productId;

      function uniqueName(base) {
        return `${base} ${Date.now()}-${Math.floor(Math.random() * 10000)}`;
      }

      async function createReferences() {
        const categoryRes = await request(server)
          .post("/api/category")
          .field("name", uniqueName("Product Category"))
          .attach("image", path.join(__dirname, "test-image.png"));
        const category = categoryRes.body.data;

        const structure = (
          await request(server)
            .post("/api/structure")
            .send({ name: uniqueName("Structure") })
        ).body.data;
        const substructure = (
          await request(server)
            .post("/api/substructure")
            .send({
              name: uniqueName("Substructure"),
              structure: structure._id,
            })
        ).body.data;
        const content = (
          await request(server)
            .post("/api/content")
            .send({ name: uniqueName("Content") })
        ).body.data;
        const design = (
          await request(server)
            .post("/api/design")
            .send({ name: uniqueName("Design") })
        ).body.data;
        const finish = (
          await request(server)
            .post("/api/finish")
            .send({ name: uniqueName("Finish") })
        ).body.data;
        const subfinish = (
          await request(server)
            .post("/api/subfinish")
            .send({ name: uniqueName("Subfinish"), finish: finish._id })
        ).body.data;
        const suitablefor = (
          await request(server)
            .post("/api/suitablefor")
            .send({ name: uniqueName("Suitablefor") })
        ).body.data;
        const subsuitable = (
          await request(server)
            .post("/api/subsuitable")
            .send({
              name: uniqueName("Subsuitable"),
              suitablefor: suitablefor._id,
            })
        ).body.data;
        const vendor = (
          await request(server)
            .post("/api/vendor")
            .send({ name: uniqueName("Vendor") })
        ).body.data;
        const groupcode = (
          await request(server)
            .post("/api/groupcode")
            .send({ name: uniqueName("Groupcode") })
        ).body.data;
        const color = (
          await request(server)
            .post("/api/color")
            .send({ name: uniqueName("Color") })
        ).body.data;

        return {
          category,
          structure,
          substructure,
          content,
          design,
          finish,
          subfinish,
          suitablefor,
          subsuitable,
          vendor,
          groupcode,
          color,
        };
      }

      beforeAll(async () => {
        // Create a product for SEO testing
        const ids = await createReferences();

        const productRes = await request(server)
          .post("/api/product")
          .field("name", uniqueName("Test Product for SEO"))
          .field("category", ids.category._id)
          .field("structure", ids.structure._id)
          .field("substructure", ids.substructure._id)
          .field("content", ids.content._id)
          .field("design", ids.design._id)
          .field("finish", ids.finish._id)
          .field("subfinish", ids.subfinish._id)
          .field("suitablefor", ids.suitablefor._id)
          .field("subsuitable", ids.subsuitable._id)
          .field("vendor", ids.vendor._id)
          .field("groupcode", ids.groupcode._id)
          .field("color", ids.color._id)
          .attach("img", path.join(__dirname, "test-image.png"));

        productId = productRes.body.data._id;
      });

      test("should create SEO data", async () => {
        const seoData = {
          product: productId,
          purchasePrice: 100.5,
          salesPrice: 150.0,
          locationCode: "US-001",
          productIdentifier: "PROD-123",
          sku: "SKU-123456",
          productdescription: "Test product description",
          popularproduct: true,
          topratedproduct: false,
          slug: "test-product-seo",
          canonical_url: "https://example.com/test-product",
          ogUrl: "https://example.com/og/test-product",
          excerpt: "Short excerpt for SEO",
          description_html: "<p>HTML description</p>",
          rating_value: 4.5,
          rating_count: 25,
          charset: "UTF-8",
          xUaCompatible: "IE=edge",
          viewport: "width=device-width, initial-scale=1.0",
          title: "Test Product SEO Title",
          description: "Test product SEO description",
          keywords: "test, product, seo, keywords",
          robots: "index, follow",
          contentLanguage: "en-US",
          googleSiteVerification: "verification-code",
          msValidate: "ms-validate-code",
          themeColor: "#ffffff",
          mobileWebAppCapable: "yes",
          appleStatusBarStyle: "default",
          formatDetection: "telephone=no",
          ogLocale: "en_US",
          ogTitle: "Open Graph Title",
          ogDescription: "Open Graph Description",
          ogType: "product",
          ogSiteName: "Test Site",
          twitterCard: "summary_large_image",
          twitterSite: "@testsite",
          twitterTitle: "Twitter Title",
          twitterDescription: "Twitter Description",
          hreflang: "en",
          x_default: "en",
          author_name: "Test Author",
        };

        const res = await request(server).post("/api/seo").send(seoData);

        expect(res.statusCode).toBe(201);
        // Response logged for debugging
        expect(res.body.data.product).toHaveProperty("_id", productId);
        expect(res.body.data).toHaveProperty("purchasePrice", 100.5);
        expect(res.body.data).toHaveProperty("popularproduct", true);
        expect(res.body.data).toHaveProperty("slug", "test-product-seo");
        seoId = res.body.data?._id;
        expect(seoId).toBeDefined();
      });

      test("should create SEO data with new meta fields", async () => {
        const seoData = {
          product: productId,
          slug: "test-product-seo-meta",
          openGraph: {
            images: "img1.jpg,img2.jpg,img3.jpg",
            video: {
              url: "https://example.com/video.mp4",
              secure_url: "https://secure.example.com/video.mp4",
              type: "video/mp4",
              width: 1280,
              height: 720,
            },
          },
          twitter: {
            image: "https://example.com/twitter-image.jpg",
            player: "https://example.com/twitter-player",
            player_width: 640,
            player_height: 360,
          },
          VideoJsonLd: '{"@type":"VideoObject"}',
          LogoJsonLd: '{"@type":"ImageObject"}',
          BreadcrumbJsonLd: '{"@type":"BreadcrumbList"}',
          LocalBusinessJsonLd: '{"@type":"LocalBusiness"}',
        };
        const res = await request(server).post("/api/seo").send(seoData);
        expect(res.statusCode).toBe(201);
        expect(res.body.data.openGraph.images).toEqual([
          "img1.jpg",
          "img2.jpg",
          "img3.jpg",
        ]);
        expect(res.body.data.openGraph.video.url).toBe(
          "https://example.com/video.mp4"
        );
        expect(res.body.data.twitter.image).toBe(
          "https://example.com/twitter-image.jpg"
        );
        expect(res.body.data.VideoJsonLd).toContain("VideoObject");
        expect(res.body.data.LogoJsonLd).toContain("ImageObject");
        expect(res.body.data.BreadcrumbJsonLd).toContain("BreadcrumbList");
        expect(res.body.data.LocalBusinessJsonLd).toContain("LocalBusiness");
      });

      test("should update SEO meta fields", async () => {
        if (!seoId) throw new Error("SEO ID is undefined. Failing early.");
        const updateData = {
          openGraph: {
            images: "img4.jpg,img5.jpg",
            video: {
              url: "https://example.com/video2.mp4",
              secure_url: "https://secure.example.com/video2.mp4",
              type: "video/mp4",
              width: 1920,
              height: 1080,
            },
          },
          twitter: {
            image: "https://example.com/twitter-image2.jpg",
            player: "https://example.com/twitter-player2",
            player_width: 800,
            player_height: 600,
          },
          VideoJsonLd: '{"@type":"VideoObject2"}',
          LogoJsonLd: '{"@type":"ImageObject2"}',
          BreadcrumbJsonLd: '{"@type":"BreadcrumbList2"}',
          LocalBusinessJsonLd: '{"@type":"LocalBusiness2"}',
        };
        const res = await request(server)
          .put(`/api/seo/${seoId}`)
          .send(updateData);
        expect(res.statusCode).toBe(200);
        expect(res.body.data.openGraph.images).toEqual([
          "img4.jpg",
          "img5.jpg",
        ]);
        expect(res.body.data.openGraph.video.url).toBe(
          "https://example.com/video2.mp4"
        );
        expect(res.body.data.twitter.image).toBe(
          "https://example.com/twitter-image2.jpg"
        );
        expect(res.body.data.VideoJsonLd).toContain("VideoObject2");
        expect(res.body.data.LogoJsonLd).toContain("ImageObject2");
        expect(res.body.data.BreadcrumbJsonLd).toContain("BreadcrumbList2");
        expect(res.body.data.LocalBusinessJsonLd).toContain("LocalBusiness2");
      });

      test("should fail to create SEO for non-existent product", async () => {
        const seoData = {
          product: "000000000000000000000000",
          title: "Test Title",
          description: "Test Description",
        };

        const res = await request(server).post("/api/seo").send(seoData);

        expect(res.statusCode).toBe(400);
        expect(res.body.message).toMatch(/Product not found/i);
      });

      test("should fail to create duplicate SEO for same product", async () => {
        const seoData = {
          product: productId,
          title: "Duplicate SEO",
          description: "Duplicate description",
        };

        const res = await request(server).post("/api/seo").send(seoData);

        expect(res.statusCode).toBe(400);
        expect(res.body.message).toMatch(/SEO data already exists/i);
      });

      test("should get all SEO data", async () => {
        const res = await request(server).get("/api/seo");
        expect(res.statusCode).toBe(200);
        expect(Array.isArray(res.body.data)).toBe(true);
        expect(res.body.data.length).toBeGreaterThan(0);
      });

      test("should get SEO by ID", async () => {
        if (!seoId) {
          throw new Error("SEO ID is undefined. Failing early.");
        }
        const res = await request(server).get(`/api/seo/${seoId}`);
        expect(res.statusCode).toBe(200);
        expect(res.body.data).toHaveProperty("_id", seoId);
        expect(res.body.data).toHaveProperty("product");
      });

      test("should get SEO by product ID", async () => {
        const res = await request(server).get(`/api/seo/product/${productId}`);
        expect(res.statusCode).toBe(200);
        expect(String(res.body.data.product._id)).toBe(String(productId));
      });

      test("should get SEO by slug", async () => {
        const res = await request(server).get("/api/seo/slug/test-product-seo");
        expect(res.statusCode).toBe(200);
        expect(res.body.data).toHaveProperty("slug", "test-product-seo");
      });

      test("should get popular products", async () => {
        const res = await request(server).get("/api/seo/popular");
        expect(res.statusCode).toBe(200);
        expect(Array.isArray(res.body.data)).toBe(true);
        expect(res.body.data.length).toBeGreaterThan(0);
        expect(res.body.data[0]).toHaveProperty("popularproduct", true);
      });

      test("should get top rated products", async () => {
        const res = await request(server).get("/api/seo/top-rated");
        expect(res.statusCode).toBe(200);
        expect(Array.isArray(res.body.data)).toBe(true);
      });

      test("should update SEO data", async () => {
        if (!seoId) {
          throw new Error("SEO ID is undefined. Failing early.");
        }
        const updateData = {
          title: "Updated SEO Title",
          description: "Updated SEO description",
          popularproduct: false,
          topratedproduct: true,
          rating_value: 4.8,
        };

        const res = await request(server)
          .put(`/api/seo/${seoId}`)
          .send(updateData);

        expect(res.statusCode).toBe(200);
        expect(res.body.data).toHaveProperty("title", "Updated SEO Title");
        expect(res.body.data).toHaveProperty("popularproduct", false);
        expect(res.body.data).toHaveProperty("topratedproduct", true);
        expect(res.body.data).toHaveProperty("rating_value", 4.8);
      });

      test("should fail to update SEO with non-existent product", async () => {
        const updateData = {
          product: "000000000000000000000000",
          title: "Updated Title",
        };

        const res = await request(server)
          .put(`/api/seo/${seoId}`)
          .send(updateData);

        expect(res.statusCode).toBe(400);
        expect(res.body.message).toMatch(/Product not found/i);
      });

      test("should delete SEO data", async () => {
        if (!seoId) {
          throw new Error("SEO ID is undefined. Failing early.");
        }
        const res = await request(server).delete(`/api/seo/${seoId}`);
        expect(res.statusCode).toBe(200);
        expect(res.body.message).toMatch(/deleted/i);
      });

      test("should return 404 for deleted SEO", async () => {
        if (!seoId) {
          throw new Error("SEO ID is undefined. Failing early.");
        }
        const res = await request(server).get(`/api/seo/${seoId}`);
        expect(res.statusCode).toBe(404);
      });
    });
  });
}
