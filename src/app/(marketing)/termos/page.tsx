import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function TermosPage() {
  return (
    <div className="py-16">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="font-display text-4xl md:text-5xl font-bold mb-8 text-center">
            Termos de Uso
          </h1>
          <p className="text-muted-foreground text-center mb-12">
            Última atualização: {new Date().toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })}
          </p>

          <div className="space-y-8">
            <Card>
              <CardHeader>
                <CardTitle className="font-heading text-2xl">1. Aceitação dos Termos</CardTitle>
              </CardHeader>
              <CardContent className="prose max-w-none">
                <p>
                  Ao acessar e utilizar o website da Garcez Palha, você concorda em cumprir e estar vinculado
                  a estes Termos de Uso. Se você não concordar com qualquer parte destes termos, não deve
                  utilizar nosso website ou serviços.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="font-heading text-2xl">2. Descrição dos Serviços</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="mb-4">A Garcez Palha oferece os seguintes serviços:</p>
                <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                  <li>Consultoria e assessoria jurídica</li>
                  <li>Perícia documental e grafotécnica</li>
                  <li>Avaliação imobiliária</li>
                  <li>Perícia médica trabalhista</li>
                  <li>Automação de serviços jurídicos</li>
                  <li>Programa de parceria e indicação</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="font-heading text-2xl">3. Uso do Website</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">3.1 Uso Permitido</h4>
                  <p className="text-muted-foreground">
                    Este website é destinado ao uso pessoal e não comercial. Você pode acessar, visualizar e
                    baixar conteúdo para fins informativos.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">3.2 Uso Proibido</h4>
                  <ul className="list-disc pl-6 space-y-1 text-muted-foreground">
                    <li>Reproduzir, distribuir ou modificar conteúdo sem autorização</li>
                    <li>Usar o site para fins ilegais ou não autorizados</li>
                    <li>Tentar acessar áreas restritas sem permissão</li>
                    <li>Transmitir vírus ou códigos maliciosos</li>
                    <li>Coletar informações de outros usuários</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="font-heading text-2xl">4. Propriedade Intelectual</CardTitle>
              </CardHeader>
              <CardContent>
                <p>
                  Todo o conteúdo deste website, incluindo textos, gráficos, logos, ícones, imagens, clipes de
                  áudio e software, é propriedade da Garcez Palha ou de seus licenciadores e está protegido
                  pelas leis brasileiras de propriedade intelectual.
                </p>
                <p className="mt-4">
                  A marca &quot;Garcez Palha&quot; e o logotipo são marcas registradas. O uso não autorizado pode
                  resultar em ação judicial.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="font-heading text-2xl">5. Conta de Usuário</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="mb-4">
                  Ao criar uma conta em nossa plataforma (Portal do Parceiro ou área administrativa), você se
                  compromete a:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                  <li>Fornecer informações verdadeiras e atualizadas</li>
                  <li>Manter a confidencialidade de suas credenciais de acesso</li>
                  <li>Notificar imediatamente qualquer uso não autorizado</li>
                  <li>Ser responsável por todas as atividades realizadas em sua conta</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="font-heading text-2xl">6. Programa de Parceiros</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p>
                  Os termos específicos do Programa de Parceiros estão sujeitos a acordo separado, que inclui:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                  <li>Estrutura de comissões e pagamentos</li>
                  <li>Obrigações do parceiro</li>
                  <li>Diretrizes de marketing e comunicação</li>
                  <li>Causas de rescisão do contrato</li>
                </ul>
                <p className="text-sm mt-4">
                  Ao se cadastrar como parceiro, você concorda com os termos específicos do programa disponíveis
                  no momento do cadastro.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="font-heading text-2xl">7. Isenção de Responsabilidade</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">7.1 Informações no Site</h4>
                  <p className="text-muted-foreground">
                    As informações disponibilizadas neste website têm caráter informativo e não constituem
                    aconselhamento jurídico. Para orientação específica sobre seu caso, consulte diretamente
                    nossos advogados.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">7.2 Disponibilidade</h4>
                  <p className="text-muted-foreground">
                    Não garantimos que o site estará disponível ininterruptamente ou livre de erros. Podemos
                    modificar, suspender ou descontinuar qualquer parte do site sem aviso prévio.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="font-heading text-2xl">8. Limitação de Responsabilidade</CardTitle>
              </CardHeader>
              <CardContent>
                <p>
                  A Garcez Palha não será responsável por quaisquer danos diretos, indiretos, incidentais,
                  especiais ou consequentes resultantes do uso ou impossibilidade de uso deste website,
                  incluindo, mas não se limitando a, perda de dados ou lucros.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="font-heading text-2xl">9. Links Externos</CardTitle>
              </CardHeader>
              <CardContent>
                <p>
                  Nosso website pode conter links para sites de terceiros. Não somos responsáveis pelo
                  conteúdo, políticas de privacidade ou práticas desses sites. Recomendamos que você leia os
                  termos e políticas de cada site que visitar.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="font-heading text-2xl">10. Comunicações Eletrônicas</CardTitle>
              </CardHeader>
              <CardContent>
                <p>
                  Ao utilizar nosso site ou nos enviar e-mails, você está se comunicando conosco
                  eletronicamente e consente em receber comunicações nossas por meios eletrônicos. Você
                  concorda que todos os acordos, avisos, divulgações e outras comunicações que fornecemos
                  eletronicamente satisfazem qualquer exigência legal.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="font-heading text-2xl">11. Lei Aplicável e Foro</CardTitle>
              </CardHeader>
              <CardContent>
                <p>
                  Estes Termos de Uso são regidos pelas leis da República Federativa do Brasil. Qualquer
                  disputa relacionada a estes termos será submetida ao foro da Comarca do Rio de Janeiro,
                  Estado do Rio de Janeiro.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="font-heading text-2xl">12. Alterações nos Termos</CardTitle>
              </CardHeader>
              <CardContent>
                <p>
                  Reservamo-nos o direito de modificar estes Termos de Uso a qualquer momento. As alterações
                  entrarão em vigor imediatamente após sua publicação neste site. O uso continuado do site
                  após tais modificações constitui sua aceitação dos novos termos.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="font-heading text-2xl">13. Contato</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="mb-4">
                  Se você tiver dúvidas sobre estes Termos de Uso, entre em contato conosco:
                </p>
                <div className="bg-muted p-4 rounded-lg space-y-2">
                  <p>
                    <strong>Garcez Palha</strong>
                  </p>
                  <p>E-mail: contato@garcezpalha.com</p>
                  <p>Telefone: (21) 3500-0000</p>
                  <p>Endereço: Centro, Rio de Janeiro - RJ</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="font-heading text-2xl">14. Disposições Finais</CardTitle>
              </CardHeader>
              <CardContent>
                <p>
                  Se qualquer disposição destes Termos for considerada inválida ou inexequível, as demais
                  disposições permanecerão em pleno vigor e efeito. A falha em exercer ou fazer cumprir
                  qualquer direito ou disposição destes Termos não constituirá renúncia a tal direito ou
                  disposição.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
