const Albums = require('../schemas/albums');

function createAlbum(albumData, cb) {
  const newfecha = new Date();
  let newAlbum = { albumData };
  newAlbum.fecha = newfecha;

  new Albums(newAlbum)
    .save()
    .then((elem) => {
      return cb(null, elem);
    })
    .catch((error) => {
      console.log('Error creating album:', error);
      return cb(error);
    });
}

function getAllAlbums(cb) {
  Albums.find({})
    .then((elems) => {
      return cb(null, elems);
    })
    .catch((error) => {
      console.log('Error retrieving albums', error);
      return cb(error);
    })
};

function getAlbumsByUserEmail(emailValue, cb) {
  Albums.find({ userEmail: emailValue })
    .then((elems) => {
      return cb(null, elems);
    })
    .catch((error) => {
      console.log('Error retrieving user albums', error);
      return cb(error);
    })
}

function getAlbumsByCourier(courierName, cb) {
  Albums.find({ courier: courierName })
    .then((elems) => {
      return cb(null, elems);
    })
    .catch((error) => {
      console.log('Error retrieving albums by courier', error);
      return cb(error);
    })
}


// UPDATE
function updateAlbum(albumData, cb) {
  const updatedData = { ...albumData };
  const newfecha = new Date();
  updatedData.fecha = newfecha;

  return Albums.findByIdAndUpdate(
    albumData._id,
    { $set: updatedData },
    { new: true }
  )
    .then((elem) => {
      return cb(null, elem);
    })
    .catch((error) => {
      console.log('Error updating album:', error);
      return cb(error);
    });
}

function getAlbumsById(albumId, cb) {
  Albums.findOne({ _id: albumId })
    .then((elems) => {
      return cb(null, elems);
    })
    .catch((error) => {
      console.log('Error retrieving albums by id', error);
      return cb(error);
    })
}

function updateAlbumList({ albums, courierName }, cb) {
  const albumIds = albums.map((album) => album._id);
  let filter = { _id: { $in: albumIds } };
  if (courierName !== null) {
    filter.courier = courierName;
  }

  let update = {
    $set: {}
  };
  for (const album of albums) {
    for (const key in album) {
      if (album[key] !== null) {
        update.$set[key] = album[key];
      }
    }
  }
  console.log("Models :: Albums :: updateAlbumList :: filter", filter);
  console.log("Models :: Albums :: updateAlbumList :: update", update);

  Albums.updateMany(filter, update)
    .then((result) => {
      console.log('Álbumes actualizados exitosamente');
      return cb(null, result);
    })
    .catch((error) => {
      console.error('Error al actualizar los álbumes:', error);
      return cb(error);
    });
}

function deleteAlbumList({ albums }, cb) {
  const albumIds = albums.map((album) => album._id);
  let filter = { _id: { $in: albumIds } };
  
  console.log("Models :: Albums :: deleteAlbumList :: filter", filter);

  Albums.deleteMany(filter, update)
    .then((result) => {
      console.log('Albumes actualizados exitosamente');
      return cb(null, result);
    })
    .catch((error) => {
      console.error('Error al actualizar los álbumes:', error);
      return cb(error);
    });
}



// DELETE
function deleteAlbumById(albumId, cb) {
  Albums.findOne({ _id: albumId })
    .then((elems) => {
      return cb(null, elems);
    })
    .catch((error) => {
      console.log('Error deleting albums by id', error);
      return cb(error);
    })
}

exports.createAlbum = createAlbum;
exports.getAllAlbums = getAllAlbums;
exports.getAlbumsByUserEmail = getAlbumsByUserEmail;
exports.getAlbumsByCourier=getAlbumsByCourier;
exports.updateAlbum = updateAlbum;
exports.getAlbumsById = getAlbumsById;
exports.deleteAlbumById = deleteAlbumById;
exports.updateAlbumList = updateAlbumList;
exports.deleteAlbumList = deleteAlbumList;
