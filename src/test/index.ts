const request = require('request');
const should = require('should');
const fs = require('fs');
const path = require('path');

const filename = path.resolve(__dirname, '../../home-and-garden.csv');
const csvStream = fs.createReadStream(filename);

describe('ShopifyProductImport', () => {
  it("The result's return should equel 0", () => {
    const options = {
      method: 'POST',
      url: 'http://localhost:3000/api/shopify/product/import',
      headers: {
        'X-Shopify-Access-Token': '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',
      },
      formData: {
        file: {
          value: csvStream,
          options: {
            filename: 'home-and-garden.csv',
            contentType: null,
          },
        },
      },
    };
    request(options, (error, response) => {
      if (error) throw new Error(error);
      response.body.should.have.property('code').which.equel(0);
    });
  });
});
