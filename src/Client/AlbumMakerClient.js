import React, { useEffect } from 'react';
import axios from "axios";

import { useSelector, useDispatch } from 'react-redux';
import { newAlbum, listAlbums, updateAlbumList } from '../reducers/albumActions';
import { FLOW_LIST, FLOW_NEW } from '../commonComponents/Properties';

import AlbumFooter from '../commonComponents/AlbumFooter';
import AlbumList from '../commonComponents/AlbumList';
import AlbumMakerCreator from './AlbumMakerCreator';
import mongoToRedux from '../commonComponents/mongoToRedux';

export default function AlbumMakerClient() {

  //redux store
  const email = useSelector(state => state.auth.user.email);
  const flow = useSelector(state => state.alb.flow);
  const albums = useSelector(state => state.alb.albumList);
  const isListFlow = flow === FLOW_LIST;

  //redux reducer
  const dispatch = useDispatch();
  const newAlbumHandler = () => {
    dispatch(newAlbum(email, albums));
  };
  const allAlbumHandler = () => {
    dispatch(listAlbums(albums));
  };
  const setAlbums = (albumList) => {
    dispatch(updateAlbumList(albumList));
  }
  const editAlbum = (album) => {
    return null;
  };
  const deleteAlbum = (id) => {
    setAlbums(albums.filter((album) => album.id !== id));
  };

  useEffect(() => {
    axios.get("http://localhost:3000/v1/client")
      .then((response) => {
        console.log("ALbumMakerClient :: useEffect :: response: ", response);
        const data = response.data.data.map((album) => mongoToRedux(album));
        console.log("ALbumMakerClient :: useEffect :: data: ", data);
        setAlbums(data);
      })
      .catch((error) => {
        console.error("ALbumMakerClient :: useEffect :: error: ", error);
      });
  }, []);

  const renderContent = () => {
    switch (flow) {
      case FLOW_LIST:
        return <AlbumList albums={albums}
          editAlbum={editAlbum}
          deleteAlbum={deleteAlbum} />;
      case FLOW_NEW:
            return <AlbumMakerCreator/>;
      default:
        return null;
    }
  }

  return (
    <div>
      <header className="d-flex flex-row bg-black bd-highlight">
        <ul className="nav flex-row d-flex p-0 bd-highlight 
        justify-content-start align-items-stretch">
          <li className="nav-item d-flex align-items-stretch me-3">
            <button className={`btn btn-dark btn-focus shadow-none ${isListFlow ? 'bg-secondary' : ''}`}
              onClick={allAlbumHandler}>
              Mis Albumes
            </button>
          </li>
          <li className="nav-item me-3">
            <button className={`btn btn-dark btn-focus shadow-none ${!isListFlow ? 'bg-secondary' : ''}`}
              onClick={newAlbumHandler}>
              Nuevo Album
            </button>
          </li>
        </ul>
      </header >
      <div className="d-flex flex-row " style={{ height: '81vh' }}>
        <div className='w-100'>
          {renderContent()}
        </div>
      </div >
      <AlbumFooter />
    </div >
  );
}
