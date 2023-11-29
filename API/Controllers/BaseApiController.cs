using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{

    /* [ApiController]
        Zbog tog atributa kada npr CreateActivitiy u POST metodi ja nemoram reci [fromBody]
         jer on uz pomoc tog atributa [ApiController] zna da objeck activity se nalazi u bodyu
    */
    [ApiController]
    [Route("api/[controller]")]
    public class BaseApiController : ControllerBase
    {

        /*Code docs
        We're creating a private variable for mediator and we're going to populate it with the mediator service.
        If some other controller comes along and decides it also needs mediator, then if it's got it in this property, great.
        If not, it's going to go and get it again.
        */
        private IMediator _mediator;
        protected IMediator Mediator => _mediator ??= HttpContext.RequestServices.GetService<IMediator>();

    }
}