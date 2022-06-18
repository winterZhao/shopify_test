import express from 'express';
import Exceljs from 'exceljs';

import rp from 'request-promise';
import { csvObj as map } from '../utils/dict';
import Base from '../utils/base';
import fileTool from '../utils/files';

interface ImageItem {
    src: string
}

interface VariantItem {
    option1?: string|number,
    option2?: string|number,
    option3?: string|number,
}

interface OptionItem {
    'name':string,
    'values': string[]
}

interface ShopifyProductItem {
    images: ImageItem[],
    variants: VariantItem[],
    options: OptionItem[],
    title: string,
    body_html: string,
    price: string,
    product_type: string
}

class ShopifyClass extends Base {
  // 导入
  async importProdcut(req: express.Request, res: express.Response) {
    try {
      const { filename, fields }: any = await fileTool.uploadFile(req);
      const result = await this.parseCsv(filename);
      await this.dealImportProduct(result);
      return {};
    } catch (e: any) {
      console.error(JSON.stringify({ functionName: 'importProdcut', error: e.stack }));
      return {
        code: 1,
        errMsg: '导入产品失败',
      };
    }
  }

  async parseCsv(filename: string): Promise<{[propName: string]:ShopifyProductItem}> {
    const workbook = new Exceljs.Workbook();
    const worksheet = await workbook.csv.readFile(filename);
    const actualRowCount: number = worksheet.actualRowCount + 1;
    const obj: any = {};
    const optionsObj: any = {};

    for (let i = 2; i < actualRowCount; i++) {
      const row = worksheet.getRow(i);
      const handle = (row.getCell(map.handle).value) as string;
      if (handle && !obj[handle]) {
        obj[handle] = {
          images: [],
          variants: [],
          options: [],
        };
        optionsObj[handle] = {};
      }

      if (!obj[handle].title) obj[handle].title = row.getCell(map.title)?.value;
      if (!obj[handle].body_html) obj[handle].body_html = row.getCell(map.body_html)?.value;
      if (!obj[handle].price) obj[handle].price = row.getCell(map.price)?.value;
      if (!obj[handle].product_type) obj[handle].product_type = row.getCell(map.product_type)?.value;

      const option1Name = row.getCell(map.option1Name)?.value;
      const option2Name = row.getCell(map.option2Name)?.value;
      const option3Name = row.getCell(map.option3Name)?.value;
      const option1Value = row.getCell(map.option1Value)?.value;
      const option2Value = row.getCell(map.option2Value)?.value;
      const option3Value = row.getCell(map.option3Value)?.value;
      const price = row.getCell(map.price)?.value;

      if (option1Name) optionsObj[handle] = { name1: option1Name, value1: new Set() };
      if (option2Name) optionsObj[handle] = { name2: option2Name, value2: new Set() };
      if (option3Name) optionsObj[handle] = { name3: option3Name, value3: new Set() };

      const variants: any = {};
      if (option1Value) {
        variants.option1 = option1Value;
        optionsObj[handle].value1.add(option1Value);
      }
      if (option2Value) {
        variants.option2 = option2Value;
        optionsObj[handle].value2.add(option2Value);
      }
      if (option3Value) {
        variants.option3 = option3Value;
        optionsObj[handle].value3.add(option3Value);
      }
      if (price) {
        variants.price = price;
      }
      obj[handle].variants.push(variants);
      obj[handle].images.push({
        src: row.getCell(map.imgSrc).value,
      });
    }
    Object.keys(optionsObj).forEach((key) => {
      const {
        name1, name2, name3, value1, value2, value3,
      } = optionsObj[key];
      if (name1) {
        obj[key].options.push({
          name: name1,
          values: [...value1],
        });
      }
      if (name2) {
        obj[key].options.push({
          name: name2,
          values: [...value2],
        });
      }
      if (name3) {
        obj[key].options.push({
          name: name3,
          values: [...value3],
        });
      }
    });
    return obj;
  }

  protected async dealImportProduct(obj:{[propName: string]:ShopifyProductItem}): Promise<void> {
    const { SHOP, TOKEN, APIVERSION } = process.env;
    const arr: any[] = [];
    Object.keys(obj).forEach((key) => {
      const options = {
        url: `https://${SHOP}.myshopify.com/admin/api/${APIVERSION}/products.json`,
        method: 'POST',
        headers: {
          'X-Shopify-Access-Token': TOKEN,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          product: obj[key],
        }),
      };
      arr.push(rp(options));
    });
    await Promise.all(arr);
  }
}

const shopifyInstance = new ShopifyClass();
export default shopifyInstance;
