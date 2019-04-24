import { Tour } from './tour.model';

// a model class to implement the custom media type requiered by the API
export class TourWithProfits extends Tour {
    estimatedProfits: number;
}
