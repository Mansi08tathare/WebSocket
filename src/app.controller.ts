import { BadRequestException, Body, Controller, Get, HttpStatus, Param, Post, Res, UploadedFile, UploadedFiles, UseGuards, UseInterceptors } from '@nestjs/common';
import { AppService } from './app.service';
import { AnyFilesInterceptor, FileFieldsInterceptor, FileInterceptor } from '@nestjs/platform-express';
// import { MulterFile } from '@nestjs/platform-express';
import { Express } from 'express';
import { SendEmailDto } from './gateway/mail.dto';


@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }


  //.......
//   @Post('upload') 
//   @UseInterceptors(
//     // AnyFilesInterceptor({ limits: { fileSize: 8*1024 } }),
//    FileInterceptor('file',{limits:{fileSize:8*1024}})
//     )
//  // @UseInterceptors(FileInterceptor('file'))
//   async uploadExcel(@UploadedFile() file: Express.Multer.File) { 
//     try{
//     console.log("file",file)
//     const jsonData = this.appService.convertExcelToJson(file.path);
//     return jsonData;
//     }catch(error){
//       console.log("error",error )
//     }
//   }


  @Post('upload')
  @UseInterceptors( FileInterceptor('file',{limits:{fileSize:8*1024}}))
  async uploadExcel(@UploadedFile() file: Express.Multer.File) {
    try {
      if (!file) {
        return {
          resp:"No File Uploaded"
        }
      }

      // To check no of rows
      let numRows = await this.appService.countRowsInExcel(file.path);

      //max row req
      const maxRowsAllowed = 3; 

      if (numRows > maxRowsAllowed) {
        return {
          resp:`Excel file exceeds maximum allowed rows (${maxRowsAllowed})`
        }
      }

      let jsonData = this.appService.convertExcelToJson(file.path);
      return jsonData;
    } catch (error) {
      console.error('Error uploading Excel file:', error);
      return{
        resp:"Error While Uploading Excel File"
      }
    }
  }


  @Post(':account_id')
  @UseInterceptors(FileFieldsInterceptor([{ name: 'files', maxCount: 10 }]))
  async sendMail(
    @Param('account_id') account_id: string,
    @Body() sendEmailDto: SendEmailDto,
    @UploadedFiles() files: { files?: Express.Multer.File[] },
    @Res() response: Response,
  ) {
    // Check the accumulative size of the files
    const totalSize = (files.files || []).reduce(
      (sum, file) => sum + file.size,
      0,
    );
    if (totalSize > 25 * 1024 * 1024) {
      // 25 MB in bytes
     return HttpStatus.BAD_REQUEST
    }

    // If the size is within limits, proceed with the service call
    const emailAttachments: Express.Multer.File[] = files?.files || [];
    // Manuallay handle success response
    // response
    //   .status(HttpStatus.OK)
    //   .send(
    //     await this.gmailAccountService.sendEmail(
    //       account_id,
    //       sendEmailDto,
    //       emailAttachments,
    //     ),
    //   );
  }



}
