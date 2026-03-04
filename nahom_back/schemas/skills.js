export default{
    name:'skills',
    title:'Skills',
    type: 'document',
    fields:[
        {
            name:'name',
            title:'Name',
            type:'string',
            validation: (Rule) => Rule.required().max(60),
        },
        {
            name:'bgColor',
            title:'BgColor',
            type:'string',
            validation: (Rule) => Rule.required(),
        },
        {
            name:'icon',
            title:'Icon',
            type: 'image',
            options: {
              hotspot: true,
            },
            validation: (Rule) => Rule.required(),
        },
        
    ]
}
