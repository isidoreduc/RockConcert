using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using TourManagement.API.Dtos;
using TourManagement.API.Helpers;
using TourManagement.API.Services;

namespace TourManagement.API.Controllers
{
    [Route("api/tours")]
    public class ToursController : Controller
    {
        private readonly ITourManagementRepository _tourManagementRepository;

        public ToursController(ITourManagementRepository tourManagementRepository)
        {
            _tourManagementRepository = tourManagementRepository;
        }

        [HttpGet]
        public async Task<IActionResult> GetTours()
        {
            var toursFromRepo = await _tourManagementRepository.GetTours();

            var tours = Mapper.Map<IEnumerable<Tour>>(toursFromRepo);
            return Ok(tours);
        }


        [HttpGet("{tourId}", Name = "GetTour")]
        // tells the client it accepts only a specific media type
        [RequestHeaderMatchesMediaType("Accept", new[] { "application/vnd.isidore.tour+json" })]
        public async Task<IActionResult> GetTour(Guid tourId) =>
            await GetTourBase<Tour>(tourId);


        [HttpGet("{tourId}")]
        [RequestHeaderMatchesMediaType("Accept",
            new[] { "application/vnd.isidore.tourWithProfits+json" })]
        public async Task<IActionResult> GetTourWithProfits(Guid tourId) =>
            await GetTourBase<TourWithProfits>(tourId);

        [HttpPost]
        [RequestHeaderMatchesMediaType("Content-Type",
            new[] { "application/vnd.isidore.tourForHttpPost+json" })]
        public async Task<IActionResult> PostTour([FromBody] TourForHttpPost tour) =>
            tour == null ? BadRequest() : await PostTourGeneric<TourForHttpPost>(tour);

        [HttpPost]
        [RequestHeaderMatchesMediaType("Content-Type",
           new[] { "application/vnd.isidore.tourWithManagerForHttpPost+json" })]
        public async Task<IActionResult> PostTourWithManager([FromBody] TourWithManagerForHttpPost tour) =>
           tour == null ? BadRequest() : await PostTourGeneric<TourWithManagerForHttpPost>(tour);



        public async Task<IActionResult> GetTourBase<T>(Guid tourId) where T : class
        {
            var tourFromRepo = await _tourManagementRepository.GetTour(tourId);

            if (tourFromRepo == null)
            {
                return BadRequest();
            }

            var tour = Mapper.Map<T>(tourFromRepo);

            return Ok(tour);
        }

        [HttpPost]
        public async Task<IActionResult> PostTourGeneric<T>(T tour) where T : class
        {
            // map the tour parameter to the entity model to add to database
            var tourEntity = Mapper.Map<Entities.Tour>(tour);
            // if no managerId, provide one (hardcoded now, auto later)
            if (tourEntity.ManagerId == Guid.Empty)
            {
                tourEntity.ManagerId = new Guid("ez7ba678-b6e0-4307-afd9-e804c23b3cd3");
            }
            // add it to repo
            await _tourManagementRepository.AddTour(tourEntity);

            if (!await _tourManagementRepository.SaveAsync())
            {
                throw new Exception("Couldn't add a new tour. Save failed.");
            }
            // map the newly created tour to 
            var tourToReturn = Mapper.Map<Tour>(tourEntity);
            //return a 201 status and appends the routing for the new tour (name of route and parameter)
            return CreatedAtRoute("GetTour", new { tourId = tourToReturn.TourId }, tourToReturn);
        }
    }
}
