import axios from 'axios';
import { z } from 'zod';

/** Nova Poshta JSON API often returns counts/flags as strings. */
const npScalar = z.union([z.string(), z.number(), z.boolean()]);

const npDayScheduleSchema = z.record(z.string(), z.string());

const npDimensionsSchema = z.looseObject({
  Width: npScalar,
  Height: npScalar,
  Length: npScalar,
});

const npAddressItemSchema = z
  .object({
    Present: z.string(),
    MainDescription: z.string(),
    Warehouses: npScalar.optional(),
    Area: z.string().optional(),
    Region: z.string().optional(),
    SettlementTypeCode: z.string().optional(),
    Ref: z.string(),
    DeliveryCity: z.string().optional(),
    AddressDeliveryAllowed: npScalar.optional(),
    StreetsAvailability: npScalar.optional(),
    ParentRegionTypes: z.string().optional(),
    ParentRegionCode: z.string().optional(),
    RegionTypes: z.string().optional(),
    RegionTypesCode: z.string().optional(),
  })
  .passthrough();

export const novaPoshtaSearchSettlementResultSchema = z
  .object({
    TotalCount: npScalar.optional(),
    Addresses: z.array(npAddressItemSchema),
    Warehouses: npScalar.optional(),
    MainDescription: z.string().optional(),
    Area: z.string().optional(),
    Region: z.string().optional(),
    SettlementTypeCode: z.string().optional(),
    Ref: z.string().optional(),
    DeliveryCity: z.string().optional(),
    Present: z.string().optional(),
    RegionTypes: z.string().optional(),
    RegionTypesCode: z.string().optional(),
    AddressDeliveryAllowed: npScalar.optional(),
    StreetsAvailability: npScalar.optional(),
    ParentRegionTypes: z.string().optional(),
    ParentRegionCode: z.string().optional(),
  })
  .passthrough();

export type NovaPoshtaSearchSettlementResult = z.infer<
  typeof novaPoshtaSearchSettlementResultSchema
>;

export const novaPoshtaWarehouseSchema = z
  .object({
    SiteKey: npScalar.optional(),
    Description: z.string(),
    DescriptionRu: z.string().optional(),
    ShortAddress: z.string().optional(),
    ShortAddressRu: z.string().optional(),
    Phone: z.string().optional(),
    TypeOfWarehouse: z.string().optional(),
    Ref: z.string(),
    Number: npScalar.optional(),
    CityRef: z.string().optional(),
    CityDescription: z.string().optional(),
    CityDescriptionRu: z.string().optional(),
    SettlementRef: z.string().optional(),
    SettlementDescription: z.string().optional(),
    SettlementAreaDescription: z.string().optional(),
    SettlementRegionsDescription: z.string().optional(),
    SettlementTypeDescription: z.string().optional(),
    SettlementTypeDescriptionRu: z.string().optional(),
    Longitude: npScalar.optional(),
    Latitude: npScalar.optional(),
    PostFinance: npScalar.optional(),
    BicycleParking: npScalar.optional(),
    PaymentAccess: npScalar.optional(),
    POSTerminal: npScalar.optional(),
    InternationalShipping: npScalar.optional(),
    SelfServiceWorkplacesCount: npScalar.optional(),
    TotalMaxWeightAllowed: npScalar.optional(),
    PlaceMaxWeightAllowed: npScalar.optional(),
    SendingLimitationsOnDimensions: npDimensionsSchema.optional(),
    ReceivingLimitationsOnDimensions: npDimensionsSchema.optional(),
    Reception: npDayScheduleSchema.optional(),
    Delivery: npDayScheduleSchema.optional(),
    Schedule: npDayScheduleSchema.optional(),
    DistrictCode: z.string().optional(),
    WarehouseStatus: z.string().optional(),
    WarehouseStatusDate: z.string().optional(),
    CategoryOfWarehouse: z.string().optional(),
    RegionCity: z.string().optional(),
    WarehouseForAgent: npScalar.optional(),
    MaxDeclaredCost: npScalar.optional(),
    DenyToSelect: npScalar.optional(),
    PostMachineType: z.string().optional(),
    PostalCodeUA: z.string().optional(),
    OnlyReceivingParcel: npScalar.optional(),
    WarehouseIndex: z.string().optional(),
  })
  .passthrough();

export type NovaPoshtaWarehouse = z.infer<typeof novaPoshtaWarehouseSchema>;

const npApiEnvelopeSchema = z
  .object({
    success: z.boolean(),
    data: z.array(z.unknown()),
    errors: z.unknown().optional(),
    warnings: z.unknown().optional(),
    info: z.unknown().optional(),
    messageCodes: z.unknown().optional(),
    errorCodes: z.unknown().optional(),
    warningCodes: z.unknown().optional(),
    infoCodes: z.unknown().optional(),
  })
  .passthrough();

export class NovaPoshta {
  private apiKey: string;

  constructor() {
    this.apiKey = process.env.NP_API_KEY || '';
  }

  async fetchCities(cityName: string): Promise<NovaPoshtaSearchSettlementResult | undefined> {
    const url = 'https://api.novaposhta.ua/v2.0/json/';
    const requestBody = {
      apiKey: this.apiKey,
      modelName: 'AddressGeneral',
      calledMethod: 'searchSettlements',
      methodProperties: {
        CityName: cityName,
        Limit: '20',
        Page: '1',
      },
    };

    const { data } = await axios.post<unknown>(url, requestBody);
    const envelope = npApiEnvelopeSchema.parse(data);

    if (!envelope.success) {
      return undefined;
    }

    const rawFirst = envelope.data[0];
    if (rawFirst === undefined) {
      return undefined;
    }

    return novaPoshtaSearchSettlementResultSchema.parse(rawFirst);
  }

  async fetchWarehouses(city: string, Limit: string): Promise<NovaPoshtaWarehouse[]> {
    const url = 'https://api.novaposhta.ua/v2.0/json/';
    const requestBody = {
      apiKey: this.apiKey,
      modelName: 'AddressGeneral',
      calledMethod: 'getWarehouses',
      methodProperties: {
        CityName: city,
        Page: '1',
        Limit,
      },
    };
    const { data } = await axios.post<unknown>(url, requestBody);
    const envelope = npApiEnvelopeSchema.parse(data);

    if (!envelope.success) {
      return [];
    }

    return z.array(novaPoshtaWarehouseSchema).parse(envelope.data);
  }
}
