using AutoMapper;
using Domain;

namespace Application.Core
{
    public class MappingProfiles : Profile
    {
        public MappingProfiles()
        {
            /*Mapiranje iz Activity u Activity.
            AutoMapper ce pogladati propsove iz prve klase 
            On ce matchirati propsove iz bodya i domain modela
            */
            CreateMap<Activity, Activity>();

        }
    }
}