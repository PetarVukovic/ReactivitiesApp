using Application.Comments;
using MediatR;
using Microsoft.AspNetCore.SignalR;

namespace API.SignalR
{
    public class ChatHub : Hub
    {
        private readonly IMediator _mediator;
        public ChatHub(IMediator mediator)
        {
            _mediator = mediator;

        }

        //We need method to send message to all the clients
        //Our client will make connection to this hub and listen for this metho.So the name is important
        public async Task SendComment(Create.Command command)
        {
            var comment = await _mediator.Send(command);
            //After this commend was saved to the database


            //We need to send the comment to all the clients who is connected to hub and listening for this method
            //Each activity will have its own group and we will send the comment to that group
            //We will use the activity id as the name of the group
            //We need to use same name in our client side RecieveComment method
            //Any client thast are connected to this hub and listening for this method will receive this comment
            await Clients.Group(command.ActivityId.ToString()).SendAsync("ReceiveComment", comment.Value);

        }

        //When client connects the hub we need to add them to the group
        /*
        So whenever a client connects, we're going to join them to a group with the name of the activity ID,
        and we're going to send them a list of comments that we get from our database.
        Any time that a comment is sent to that group, then they're going to receive that new comment based
        on this method here.
        */

        public override async Task OnConnectedAsync()
        {
            var httpContext = Context.GetHttpContext();//We need to get the http context BECAUSE we need to get the query string
            //We need to get the activity id from the query string in the http context
            var activityId = httpContext.Request.Query["activityId"];

            await Groups.AddToGroupAsync(Context.ConnectionId, activityId);//We need to add the connection to the group

            var result = await _mediator.Send(new List.Query { ActivityId = Guid.Parse(activityId) });//We need to send list of comments to the client

            await Clients.Caller.SendAsync("LoadComments", result.Value);//We need to send the comments to the client who just connected to the hub

        }




    }
}