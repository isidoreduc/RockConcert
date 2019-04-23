using System;
using System.Linq;
using Microsoft.AspNetCore.Mvc.ActionConstraints;

namespace TourManagement.API.Helpers
{
    // our action constraint attribute class with regards to header media types
    // we allow multiple instances of this attribute to decorate multiple media types 
    // (for example, multiple constraint attribute instances for Accept header, same for Content-Type header)
    [AttributeUsage(AttributeTargets.All, Inherited = true, AllowMultiple = true)]
    public class RequestHeaderMatchesMediaTypeAttribute : Attribute, IActionConstraint
    {
        // a list of allowed media types
        private readonly string[] _mediaTypes;
        // request header that contains a media type to confront on the available list of allowed media types
        private readonly string _requestHeaderToMatch;

        public RequestHeaderMatchesMediaTypeAttribute(string[] mediaTypes, string requestHeaderToMatch)
        {
            _mediaTypes = mediaTypes;
            _requestHeaderToMatch = requestHeaderToMatch;
        }

        // order decides which stage the constraint runs in; action constraints run in group based on the order; 
        // HTTP method attributes all use the same value, so they can run in the same stage => order value is 0. 
        public int Order => 0;

        public bool Accept(ActionConstraintContext context)
        {
            var requestHeaders = context.RouteContext.HttpContext.Request.Headers;
            if (!requestHeaders.ContainsKey(_requestHeaderToMatch))
            {
                return false;
            }

            // if one media type matches, return true
            foreach (var mediaType in _mediaTypes)
            {
                var headerValues = requestHeaders[_requestHeaderToMatch].ToString().Split(',').ToList();
                foreach (var headerValue in headerValues)
                {
                    if (string.Equals(headerValue, mediaType, StringComparison.OrdinalIgnoreCase))
                    {
                        return true;
                    }
                }
            }
            return false;
        }
    }
}