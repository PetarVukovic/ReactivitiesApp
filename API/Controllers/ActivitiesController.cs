using Application.Activities;
using Domain;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{

    public class ActivitiesController : BaseApiController
    {


        /*MediatR and send method
        je biblioteka koja nam omogućava da izvršimo komunikaciju između naših različitih slojeva.
        On salje send u application layer i onda se to vraca u API.
        The Send method of the mediator handles the communication with the corresponding handlers and executes the logic defined in them.
        */

        [Authorize]
        [HttpGet]//api/activities
        public async Task<IActionResult> GetActivities()
        {
            return HandleResult(await Mediator.Send(new List.Query()));
        }

        [HttpGet("{id}")]//api/activities/id
        public async Task<IActionResult> GetActivity(Guid id)
        {
            IMediator mediator = Mediator;
            var result = await mediator.Send(new Details.Query { Id = id });
            return HandleResult(result);
        }

        [HttpPost]
        public async Task<IActionResult> CreateActivity(Activity activity)
        {
            return HandleResult(await Mediator.Send(new Create.Command { Activity = activity }));
        }


        [Authorize(Policy = "IsActivityHost")]//Only the host of activity can edit or delet it ,other can add their apperance to activity
        [HttpPut("{id}")]//api/activities/id
        public async Task<IActionResult> EditActivity(Guid id, Activity activity)
        {
            activity.Id = id;
            return HandleResult(await Mediator.Send(new Edit.Command { Activity = activity }));
        }

        [HttpDelete("{id}")]//api/activities/id
        [Authorize(Policy = "IsActivityHost")]
        public async Task<IActionResult> DeleteActivity(Guid id)
        {

            return HandleResult(await Mediator.Send(new Delete.Command { Id = id }));
        }

        [HttpPost("{id}/attend")]//api/activities/id/attend
        public async Task<IActionResult> Attend(Guid id)
        {
            return HandleResult(await Mediator.Send(new UpdateAttendance.Command { Id = id }));
        }



    }
}