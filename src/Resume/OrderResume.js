import React from 'react';
import axios from "axios";
import { format } from 'date-fns';

import { useSelector, useDispatch } from 'react-redux';
import { updateAlbumList, processComplete, saveComplete } from '../reducers/albumActions';
import { FLOW_PROCESED, FLOW_SAVED } from '../commonComponents/Properties';


import BillingViewer from '../BillingAndShipping/BillingViewer';
import AlbumViewer from '../Album/AlbumViewer';
import ProcessCompleteMessage from './ProcessCompleteMessage';
import SaveToS3 from '../Aws/SaveToS3';
import mongoToRedux from '../commonComponents/mongoToRedux';

export default function OrderResume() {

  //redux store
  const flow = useSelector(state => state.alb.flow);
  const albumData = useSelector(state => state.alb);
  const isProcessedFlow = flow === FLOW_PROCESED || flow === FLOW_SAVED;

  //redux reducer
  const dispatch = useDispatch();
  const saveAlbum = async () => {
    console.log('OrderResume :: AddAlbum :: albumState: ', albumData);
    const currentDate = format(new Date(), 'yyyyMMddHHmmss');
    const newAlbum = {
      "albumId": albumData.albumId,
      "userEmail": albumData.userEmail,
      "fecha": currentDate,
      "identificationNumber": albumData.billing.identificationNumber,
      "name": albumData.billing.name,
      "lastName": albumData.billing.lastName,
      "telephone": albumData.billing.telephone,
      "city": albumData.billing.city,
      "address": albumData.billing.address,
      "identificationNumberS": albumData.shipping.identificationNumber,
      "nameS": albumData.shipping.name,
      "telephoneS": albumData.shipping.telephone,
      "cityS": albumData.shipping.city,
      "addressS": albumData.shipping.address,
      "imageUrlList": albumData.imageUrlList,
      "template": albumData.template,
      "estado": albumData.estado,
      "operador": albumData.operador,
      "courier": albumData.courier,
      "motivoCancelacion": albumData.motivoCancelacion
    };
    console.log("OrderResume :: SaveAlbum :: imageLuist: ", albumData.imageList);
    const saveNewImages = albumData.imageList.some((file) => file&&file.status === "NEW");
    console.log("OrderResume :: SaveAlbum :: saveNewImage: ", saveNewImages);

    if (saveNewImages) {
      const uploadedUrls = await SaveToS3(albumData.imageList);
      console.log("OrderResume :: SaveAlbum :: uploadedUrls:",uploadedUrls);
      newAlbum.imageUrlList = uploadedUrls;
    }

    console.log("OrderResume :: SaveAlbum :: albumNew: ", newAlbum);

    return axios
      .post("http://localhost:3000/clients/album", { newAlbum })
      .then((response) => {
        const data =mongoToRedux(response.data.data);
        console.log('Data:', data);
        console.log("OrderResume :: handleOnClick :: Album almacenado exitosamente");
        let newAlbumList=albumData.albumList&&[...albumData.albumList];
        newAlbumList.push(data);
        dispatch(updateAlbumList(newAlbumList));
        dispatch(saveComplete());
      })
      .catch((error) => {
        console.log('Error:', error);
        dispatch(processComplete());
      });
  };
  return (
    <div className="d-flex flex-column">
      <main className="d-flex flex-column">
        <div className="d-flex flex-row justify-content-center my-1">
          <div className="w-50">
            <AlbumViewer />
          </div>
          <div className="w-50">
            <BillingViewer />
          </div>
        </div>
        {isProcessedFlow ?
          <ProcessCompleteMessage /> : (
            <div className="row">
              <button type="button" className="m-3 p3 
                  btn btn-primary w-25 mx-auto align-bottom scroll-to-top"
                onClick={() => saveAlbum()}>Finalizar Pedido</button>
            </div>
          )}
      </main>
    </div>
  );
}