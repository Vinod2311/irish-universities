import { db } from "../models/db.js";
import { universitySpec } from "../models/joi-schemas.js";
import { imageStore } from "../models/images-store.js";

export const countyController = {
  index: {
    handler: async function (request, h) {
      const county = await db.countyStore.getCountyById(request.params.id);
      const viewData = {
        title: "County",
        county: county,
      };
      return h.view("county-view", viewData);
    },
  },

  

  addUniversity: {
    validate: {
      payload: universitySpec,
      options: { abortEarly: false },
      failAction: async function (request, h, error) {
        const county = await db.countyStore.getCountyById(request.params.id);
        const viewData = {
          title: "Add university error",
          county: county,
          errors: error.details
        }
          return h.view("county-view", viewData).takeover().code(400);
      }
  },
    handler: async function (request, h) {
      const county = await db.countyStore.getCountyById(request.params.id);
      const newUniversity = {
        name: request.payload.name,
        lat: request.payload.lat,
        lng: request.payload.lng,
        description: request.payload.description,
      };
      await db.universityStore.addUniversity(county._id, newUniversity);
      return h.redirect(`/county/${county._id}`);
    },
  },

  deleteUniversity: {
    handler: async function (request, h) {
      const county = await db.countyStore.getCountyById(request.params.id);
      await db.universityStore.deleteUniversityById(request.params.universityId);
      return h.redirect(`/county/${county._id}`);
    },
  },

  uploadImage: {
    handler: async function (request, h) {
      try {
        const county = await db.countyStore.getCountyById(request.params.id);
        const file = request.payload.imagefile;
        if (Object.keys(file).length > 0) {
          const url = await imageStore.uploadImage(request.payload.imagefile);
          county.img = url;
          await db.countyStore.updateCounty(county);
        }
        return h.redirect(`/county/${county._id}`);
      } catch (err) {
        console.log(err);
        return h.redirect(`/county/${county._id}`);
      }
    },
    payload: {
      multipart: true,
      output: "data",
      maxBytes: 209715200,
      parse: true,
    },
  },

  deleteImage: {
    handler: async function (request, h) {
      try {
      const county = await db.countyStore.getCountyById(request.params.id);
      if (county.img) {
        await imageStore.deleteImage(county.img).then(result=>console.log(result));
        county.img = "";
        await db.countyStore.updateCounty(county);
      }
      return h.redirect(`/county/${county._id}`);
      } catch (err) {
        console.log(err);
        return h.redirect(`/county/${county._id}`);
      }
    }
  },
};
