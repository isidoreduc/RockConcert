using System;
namespace TourManagement.API.Dtos
{
    public class TourWithManagerForHttpPost : TourBase
    {
        public Guid ManagerId { get; set; }
    }
}
