import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';import { Http } from '@angular/http';import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer';
import { HttpClient } from '@angular/common/http';
@Injectable()
export class ImagesProvider {
  

  constructor(public http: Http, private transfer: FileTransfer,private https: HttpClient) { }

 

  uploadImage(img,desc) {

    // Destination URL
    //let url = this.apiURL + 'images';
    let url = "http://186.154.95.101/ocrpastillero/" + 'formula';

    // File for Upload
    var targetPath = img;

    var options: FileUploadOptions = {
      fileKey: 'filename',
      chunkedMode: false,
      mimeType: 'multipart/form-data',
      params: { 'desc': desc }
    };

    const fileTransfer: FileTransferObject = this.transfer.create();

    // Use the FileTransfer to upload the image
    console.log("A punto de hacer el envio");
 
    return fileTransfer.upload(targetPath, url, options);
  }

  efectos(medicamento) {
    var url='http://186.154.95.101/ocrpastillero/efectosAdversos?medicamento='+medicamento+'';
    return new Promise(resolve => {
      this.https.get(url).subscribe(data => {
        resolve(data);
      }, err => {
        console.log("err provider");
        console.log(err);
      });
    });
  }

  efectos1(medicamento) {
    var url='http://186.154.95.101/ocrpastillero/efectosAdversos?medicamento='+medicamento;
    console.log(url);
    this.http.get(url).map(res =>res.json()).subscribe(data =>{
      console.log("data");
      //console.log(data);
    });
  }

}
