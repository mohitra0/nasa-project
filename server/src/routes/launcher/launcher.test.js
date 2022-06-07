const supertest=require('supertest');
const app=require('../../app');
const {mongoConnect,mongoDisconnect}=require('../../services/mongo');
describe('Launch API tests',()=>{
      beforeAll(async()=>{
        await mongoConnect();
     });
     afterAll(async()=>{
        await mongoDisconnect();
     });
    describe('Test Get /launches',()=>{
        test('It should respond with 200 response',async ()=>{
            const response = await supertest(app).get('/v1/launches')
            .expect('Content-Type', /json/)
            .expect(200);
        });
    });
    
    describe('Test POST /launch',() => {
        const launchdata={
            mission:"UIIDK",
            rocket:"idk",
            target:"Kepler-62 f",
            launchDate:"23 December, 2222"
           };
           const launchdatawithoutdate={
            mission:"UIIDK",
            rocket:"idk",
            target:"Kepler-62 f",
           };
           const invalidDateData = {
            mission:"UIIDK",
            rocket:"idk",
            target:"Kepler-62 f",
            launchDate:"Zantar"
           };
        test('It should respond with 200 response',async()=>{
         
    
            const response = await supertest(app).post('/v1/launches')
            .send(launchdata)
            .expect('Content-Type', /json/)
            .expect(200);
            const requestdate=new Date(launchdata.launchDate).valueOf();
            const responsedate=new Date(response.body.launchDate).valueOf();
            expect(requestdate).toBe(responsedate);
            expect(response.body).toMatchObject(launchdatawithoutdate);
        });
    
        test('It should catch missiog propterties',async()=>{
            const response = await supertest(app).post('/v1/launches')
            .send(launchdatawithoutdate)
            .expect('Content-Type', /json/)
            .expect(400);
            expect(response.body).toStrictEqual({
            error: 'Missing Luanch Item',
            })
        });
        test('It should catch invalid date',async()=>{
            const response = await supertest(app).post('/v1/launches')
            .send(invalidDateData)
            .expect('Content-Type', /json/)
            .expect(400);
            expect(response.body).toStrictEqual({
                error: 'Invalid date item',
            })
        });
    });
});
