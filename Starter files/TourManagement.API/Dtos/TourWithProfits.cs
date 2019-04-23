using System;
namespace TourManagement.API.Dtos
{
    // adding a dto for implementing our vendor media type vnd.isidore.tourWithProfits+json
    public class TourWithProfits : Tour
    {
        public decimal EstimatedProfits { get; set; }
    }
}
