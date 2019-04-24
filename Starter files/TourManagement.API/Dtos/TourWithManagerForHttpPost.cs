using System;
namespace TourManagement.API.Dtos
{
    public class TourWithManagerForHttpPost : TourBase
    {
        public string ManagerId { get; set; }
    }
}
