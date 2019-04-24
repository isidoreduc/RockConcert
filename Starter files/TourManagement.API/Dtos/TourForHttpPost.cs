using System;
namespace TourManagement.API.Dtos
{
    public class TourForHttpPost : TourBase
    {
        public Guid BandId { get; set; }
    }
}
