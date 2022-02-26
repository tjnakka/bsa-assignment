import { ApiProperty } from '@nestjs/swagger';

export class getDataModel {
  @ApiProperty({
    description: 'ISO 3166 Country Code.',
    default: 'US',
    type: String,
  })
  country_code: string;

  @ApiProperty({
    description: 'Category Codes of Parameters.',
    default: ['co2'],
    type: [String],
    enum: [
      'co2',
      'ghgswico',
      'ghgs',
      'hfcs',
      'ch4',
      'nf3',
      'n2o',
      'pfcs',
      'sf6',
      'mhpcs',
    ],
    isArray: true,
  })
  category_code: string[];

  @ApiProperty({
    description: 'Start Year from which data is Required.',
    minimum: 1990,
    default: 1990,
    required: false,
    type: Number,
  })
  start_year: number;

  @ApiProperty({
    description: 'End Year from which data is Required.',
    minimum: 2017,
    default: 2017,
    required: false,
    type: Number,
  })
  end_year: number;

  category_code_string: string;
}
