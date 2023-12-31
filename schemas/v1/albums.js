const mongoose = require('mongoose');

const albums = new mongoose.Schema({
  albumId: String,
  userEmail: String,
  fecha: Date,
  identificationNumber: String,
  name: String,
  telephone: String,
  city: String,
  address: String,
  identificationNumberS: String,
  nameS: String,
  telephoneS: String,
  cityS: String,
  addressS: String,
  imageUrlList: { type: [String] },
  template: String,
  estado: String,
  operador: String,
  courier: String,
  motivoCancelacion: String
});

const Album = mongoose.model('album', albums);

module.exports = Album;