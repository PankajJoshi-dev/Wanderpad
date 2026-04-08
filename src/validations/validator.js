import Joi from "joi";

const joiListingSchema = Joi.object({
  title: Joi.string().trim().required(),
  description: Joi.string().trim().required(),
  price: Joi.number().positive().required(),
  category: Joi.string().lowercase().trim().required(),
  location: Joi.string().lowercase().trim().required(),
  country: Joi.string().trim().required(),
});

const joiReviewSchema = Joi.object({
  ratedStars: Joi.number().integer().min(1).max(5).required(),
  comment: Joi.string().trim().required(),
});

const joiUserSchema = Joi.object({
  email: Joi.string().trim().email().required(),
  username: Joi.string().trim().lowercase().required(),
  password: Joi.string().trim().required(),
});

const joiLoginSchema = Joi.object({
  username: Joi.string().trim().lowercase().required(),
  password: Joi.string().trim().required(),
})

export { joiListingSchema, joiReviewSchema, joiUserSchema, joiLoginSchema };
