
using Application.Interfaces;
using Application.Photos;
using AutoMapper;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    public class PhotosController : BaseApiController
    {


        [HttpPost]
        //FromForm is used to tell the controller that we are sending a form and Add.Command is the command type of the request
        //We are sending a file to the server
        public async Task<IActionResult> Add([FromForm] Add.Command command)
        {
            var result = await Mediator.Send(command);

            if (!result.IsSuccess) return BadRequest(result.Error);

            return Ok(result.Value);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(string id)
        {
            var result = await Mediator.Send(new Delete.Command { id = id });

            if (!result.IsSuccess) return BadRequest(result.Error);

            return Ok();
        }

        [HttpPost("{id}/setMainPhoto")]
        public async Task<IActionResult> SetMain(string id)
        {
            var result = await Mediator.Send(new SetMainPhoto.Command { Id = id });

            if (!result.IsSuccess) return BadRequest(result.Error);

            return Ok(result.Value);
        }


    }
}