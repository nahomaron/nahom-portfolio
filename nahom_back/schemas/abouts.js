export default{
    name:'abouts',
    title:'Abouts',
    type: 'document',
    fields:[
        {
            name:'title',
            title:'Title',
            type:'string',
            validation: (Rule) => Rule.required().max(120),
        },
        {
            name:'description',
            title:'Description',
            type:'string',
            validation: (Rule) => Rule.required().max(300),
        },
        {
            name:'imgUrl',
            title:'ImgUrl',
            type: 'image',
            options: {
              hotspot: true,
            },
            validation: (Rule) => Rule.required(),
        },
        {
            name: 'links',
            title: 'links',
            type: 'url',
            validation: (Rule) => Rule.required().uri({
                scheme: ['http', 'https']
            }),
        },
        
    ]
}
