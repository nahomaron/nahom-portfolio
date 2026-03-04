export default{
    name:'researches',
    title:'Researches',
    type: 'document',
    fields:[
        {
            name:'title',
            title:'Title',
            type:'string'
        },
        {
            name:'description',
            title:'Description',
            type:'string'
        },
        {
            name:'imgUrl',
            title:'ImgUrl',
            type: 'image',
            options: {
              hotspot: true,
            },
        },
        {
            name: 'paperUrl',
            title: 'URL',
            type: 'string'
        },
        
    ]
}